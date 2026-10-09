package com.alxy.accountservice.utils;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.Map;


@Component
public class JwtUtil {
    // JWT 签名密钥通过环境变量 JWT_KEY 注入，避免硬编码（默认值仅用于本地开发）
    private static volatile String key = System.getenv().getOrDefault("JWT_KEY", "fx-dev-secret");

    @Value("${JWT_KEY:fx-dev-secret}")
    public void setKey(String k) {
        if (k != null && !k.isEmpty()) {
            key = k;
        }
    }

    // 生成 token，加入超时时间
    public static String genToken(Map<String, Object> claims) {
        return JWT.create()
                .withClaim("claims", claims)
                .withExpiresAt(new Date(System.currentTimeMillis() + 1000 * 60 * 60 * 12))
                .sign(Algorithm.HMAC256(key));
    }

    // 解析并验证 token，返回业务数据
    public static Map<String, Object> parseToken(String token) {
        return JWT.require(Algorithm.HMAC256(key))
                .build()
                .verify(token)
                .getClaim("claims")
                .asMap();
    }
}