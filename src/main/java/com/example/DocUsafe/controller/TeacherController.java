package com.example.DocUsafe.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.example.DocUsafe.dto.ApiResponse;
import com.example.DocUsafe.dto.UserResponse;
import com.example.DocUsafe.service.UserService;

@RestController
@RequestMapping("/api/teachers")
public class TeacherController {

    private final UserService userService;

    public TeacherController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping
    public ApiResponse<List<UserResponse>> listTeachers() {
        return ApiResponse.success("Teachers fetched", userService.listTeachers());
    }
}
