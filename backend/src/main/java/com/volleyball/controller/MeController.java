package com.volleyball.controller;

import com.volleyball.dto.ApiResponse;
import com.volleyball.dto.UserResponse;
import com.volleyball.repository.UserRepository;
import com.volleyball.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/me")
@RequiredArgsConstructor
public class MeController {
    private final UserRepository userRepository;
    private final UserService userService;

    @GetMapping
    public ResponseEntity<ApiResponse<UserResponse>> getCurrentUser(Authentication authentication) {
        try {
            UserDetails userDetails = (UserDetails) authentication.getPrincipal();
            String email = userDetails.getUsername();


            UserResponse user = userService.getUserById(
                    userRepository.findByEmail(email)
                            .orElseThrow(() -> new RuntimeException("User not found"))
                            .getId()
            );

            return ResponseEntity.ok(ApiResponse.success(user));
        } catch (Exception e) {
            return ResponseEntity.badRequest()
                    .body(ApiResponse.error("Failed to retrieve user information: " + e.getMessage()));
        }
    }
}


