package com.alxy.accountservice.Service;

import com.alxy.accountservice.DTO.ClientDTO;
import com.alxy.accountservice.DTO.Result;

public interface AuthService {


    public Result<?> loginWithPassword(String phoneNumber, String password);

    public Result<?> loginWithOAuth2(String oauthCode, String provider);

    public Result<?> createUser(ClientDTO request);
}