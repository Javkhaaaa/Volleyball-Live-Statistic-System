package com.volleyball.service;

import com.volleyball.dto.CreateUserRequest;
import com.volleyball.dto.UserResponse;
import com.volleyball.entity.AuditLog;
import com.volleyball.entity.User;
import com.volleyball.repository.AuditLogRepository;
import com.volleyball.repository.UserRepository;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserService {
    private final UserRepository userRepository;
    private final AuditLogRepository auditLogRepository;
    private final PasswordEncoder passwordEncoder;

    @Transactional
    public UserResponse createUser(CreateUserRequest request, Long createdByUserId, HttpServletRequest httpRequest) {
        // Check if email already exists
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("User with email " + request.getEmail() + " already exists");
        }

        // Validate role - Only COACH and STATISTICIAN can be created
        if (!"COACH".equals(request.getRole()) && !"STATISTICIAN".equals(request.getRole())) {
            throw new IllegalArgumentException("Only COACH and STATISTICIAN roles can be created");
        }

        // Get creator user
        User creator = userRepository.findById(createdByUserId)
                .orElseThrow(() -> new IllegalArgumentException("Creator user not found"));

        // Create new user
        User user = new User();
        user.setEmail(request.getEmail());
        user.setPasswordHash(passwordEncoder.encode(request.getPassword()));
        user.setFirstName(request.getFirstName());
        user.setLastName(request.getLastName());
        user.setPhone(request.getPhone());
        user.setRole(request.getRole());
        user.setIsActive(true);
        user.setIsLocked(false);
        user.setFailedLoginAttempts(0);
        user.setCreatedBy(creator);

        user = userRepository.save(user);

        // Log audit event
        logAuditEvent(creator, "USER_CREATED", "USER", user.getId(),
                "Created user: " + user.getEmail() + " with role: " + request.getRole(),
                httpRequest);

        return mapToUserResponse(user);
    }

    @Transactional(readOnly = true)
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(this::mapToUserResponse)
                .collect(Collectors.toList());
    }

    @Transactional(readOnly = true)
    public UserResponse getUserById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));
        return mapToUserResponse(user);
    }

    @Transactional
    public void deleteUser(Long id, Long deletedByUserId, HttpServletRequest httpRequest) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("User not found with id: " + id));

        // Prevent self-deletion
        if (user.getId().equals(deletedByUserId)) {
            throw new IllegalArgumentException("Cannot delete your own account");
        }

        User deleter = userRepository.findById(deletedByUserId)
                .orElseThrow(() -> new IllegalArgumentException("Deleter user not found"));

        // Log audit event before deletion
        logAuditEvent(deleter, "USER_DELETED", "USER", user.getId(),
                "Deleted user: " + user.getEmail(),
                httpRequest);

        userRepository.delete(user);
    }

    private UserResponse mapToUserResponse(User user) {
        UserResponse response = new UserResponse();
        response.setId(user.getId());
        response.setEmail(user.getEmail());
        response.setFirstName(user.getFirstName());
        response.setLastName(user.getLastName());
        response.setPhone(user.getPhone());
        response.setIsActive(user.getIsActive());
        response.setIsLocked(user.getIsLocked());
        response.setLastLoginAt(user.getLastLoginAt());
        response.setRoles(user.getRole() != null ? List.of(user.getRole()) : List.of());
        response.setCreatedAt(user.getCreatedAt());
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


