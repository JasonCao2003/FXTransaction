package com.alxy.accountservice.Service.impl;

import com.alxy.accountservice.Controller.ClientServiceFeign;
import com.alxy.accountservice.Entity.Client;
import com.alxy.accountservice.Repository.UserRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class KycCheckService {

    private final ClientServiceFeign clientServiceFeign;
    private final UserRepository userRepository;
    
    @Transactional
    @Scheduled(cron = "0 * * * * ?")
//    @Scheduled(cron = "0 0 0 * * ?")  每日凌晨
    public void checkAndUpdateKycStatus() {
        List<Client> expiredClients = clientServiceFeign.findByKycDueDateBefore(LocalDate.now()).getData();
        for (Client client : expiredClients) {
            if (client.getUserId() != null) {
                // 修改用户表级别和状态
                userRepository.updateIdentityIdByUserId(client.getUserId(),0,"冻结");
                // 修改客户表级别和状态
                clientServiceFeign.updateStatusById(client.getClientId(),"冻结");
            }
        }
    }
}
