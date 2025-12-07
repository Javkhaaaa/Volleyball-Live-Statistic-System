package com.volleyball.service;

import com.volleyball.dto.LoginRequest;
import com.volleyball.dto.LoginResponse;
import com.volleyball.dto.RefreshTokenRequest;
import com.volleyball.entity.AuditLog;
import com.volleyball.entity.User;
import com.volleyball.repository.AuditLogRepository;
import com.volleyball.repository.UserRepository;
import com.volleyball.util.JwtUtil;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.LockedException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final UserDetailsService userDetailsService;

    private static final int MAX_LOGIN_ATTEMPTS = 5;
    private static final int LOCK_DURATION_MINUTES = 30;

    @Transactional
    public LoginResponse login(LoginRequest request, HttpServletRequest httpRequest) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> {
                    logAuditEvent(null, "LOGIN_FAILED", "USER", null,
                            "Invalid email: " + request.getEmail(),
                            httpRequest);
                    return new BadCredentialsException("Invalid email or password");
                });

        // Check if account is locked
        if (user.getIsLocked() && user.getLockedUntil() != null) {
            if (LocalDateTime.now().isBefore(user.getLockedUntil())) {
                logAuditEvent(user, "LOGIN_FAILED", "USER", user.getId(),
                        "Account is locked until " + user.getLockedUntil(),
                        httpRequest);
                throw new LockedException("Account is locked. Please try again later.");
            } else {
                // Unlock account if lock period has expired
                user.setIsLocked(false);
                user.setLockedUntil(null);
                user.setFailedLoginAttempts(0);
                userRepository.save(user);
            }
        }

        // Check if account is active
        if (!user.getIsActive()) {
            logAuditEvent(user, "LOGIN_FAILED", "USER", user.getId(),
                    "Account is inactive",
                    httpRequest);
            throw new BadCredentialsException("Account is inactive");
        }

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
            );

            UserDetails userDetails = (UserDetails) authentication.getPrincipal();

            // Reset failed login attempts on successful login
            user.setFailedLoginAttempts(0);
            user.setIsLocked(false);
            user.setLockedUntil(null);
            user.setLastLoginAt(LocalDateTime.now());
            userRepository.save(user);

            // Generate tokens
            String userRole = user.getRole() != null ? user.getRole() : "";
            if (userRole.isEmpty()) {
                throw new BadCredentialsException("User role is not set");
            }

            String accessToken = jwtUtil.generateAccessToken(userDetails, user.getId(), userRole);
            String refreshToken = jwtUtil.generateRefreshToken(userDetails, user.getId());

            // Log successful login
            logAuditEvent(user, "LOGIN_SUCCESS", "USER", user.getId(),
                    "User logged in successfully",
                    httpRequest);

            // Build response
            LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
            userInfo.setId(user.getId());
            userInfo.setEmail(user.getEmail());
            userInfo.setFirstName(user.getFirstName());
            userInfo.setLastName(user.getLastName());
            userInfo.setRoles(user.getRole() != null ? List.of(user.getRole()) : List.of());

            LoginResponse response = new LoginResponse();
            response.setAccessToken(accessToken);
            response.setRefreshToken(refreshToken);
            response.setExpiresIn(jwtUtil.getAccessTokenExpiration());
            response.setUser(userInfo);

            return response;

        } catch (BadCredentialsException e) {
            // Increment failed login attempts
            user.setFailedLoginAttempts(user.getFailedLoginAttempts() + 1);

            if (user.getFailedLoginAttempts() >= MAX_LOGIN_ATTEMPTS) {
                user.setIsLocked(true);
                user.setLockedUntil(LocalDateTime.now().plusMinutes(LOCK_DURATION_MINUTES));
            }

            userRepository.save(user);

            logAuditEvent(user, "LOGIN_FAILED", "USER", user.getId(),
                    "Invalid password. Attempts: " + user.getFailedLoginAttempts(),
                    httpRequest);

            throw new BadCredentialsException("Invalid email or password");
        }
    }

    @Transactional
    public LoginResponse refreshToken(RefreshTokenRequest request) {
        if (!jwtUtil.validateRefreshToken(request.getRefreshToken())) {
            throw new BadCredentialsException("Invalid refresh token");
        }

        String email = jwtUtil.extractUsername(request.getRefreshToken());
        UserDetails userDetails = userDetailsService.loadUserByUsername(email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (!user.getIsActive() || user.getIsLocked()) {
            throw new BadCredentialsException("Account is inactive or locked");
        }

        String userRole = user.getRole() != null ? user.getRole() : "";
        if (userRole.isEmpty()) {
            throw new BadCredentialsException("User role is not set");
        }

        String newAccessToken = jwtUtil.generateAccessToken(userDetails, user.getId(), userRole);
        String newRefreshToken = jwtUtil.generateRefreshToken(userDetails, user.getId());

        LoginResponse.UserInfo userInfo = new LoginResponse.UserInfo();
        userInfo.setId(user.getId());
        userInfo.setEmail(user.getEmail());
        userInfo.setFirstName(user.getFirstName());
        userInfo.setLastName(user.getLastName());
        userInfo.setRoles(user.getRole() != null ? List.of(user.getRole()) : List.of());

        LoginResponse response = new LoginResponse();
        response.setAccessToken(newAccessToken);
        response.setRefreshToken(newRefreshToken);
        response.setExpiresIn(jwtUtil.getAccessTokenExpiration());
        response.setUser(userInfo);

        return response;
    }

    private void logAuditEvent(User user, String action, String entityType, Long entityId,
                              String details, HttpServletRequest request) {
        AuditLog auditLog = new AuditLog();
        auditLog.setUser(user);
        auditLog.setAction(action);
        auditLog.setEntityType(entityType);
        auditLog.setEntityId(entityId);
        auditLog.setDetails(details);
        auditLog.setIpAddress(getClientIpAddress(request));
        auditLog.setUserAgent(request.getHeader("User-Agent"));
        auditLogRepository.save(auditLog);
    }

    private String getClientIpAddress(HttpServletRequest request) {
        String xForwardedFor = request.getHeader("X-Forwarded-For");
        if (xForwardedFor != null && !xForwardedFor.isEmpty()) {
            return xForwardedFor.split(",")[0].trim();
        }
        return request.getRemoteAddr();
    }
}


