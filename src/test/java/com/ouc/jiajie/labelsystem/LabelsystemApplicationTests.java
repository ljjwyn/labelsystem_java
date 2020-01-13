package com.ouc.jiajie.labelsystem;

import com.ouc.jiajie.labelsystem.kg.entity.userManagement;
import com.ouc.jiajie.labelsystem.kg.mapper.UserManagementMapper;
import org.junit.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

@SpringBootTest
public class LabelsystemApplicationTests {

    @Autowired
    public static UserManagementMapper userManagementMapper;

    @Test
    public void contextLoads() {
        userManagement user = userManagementMapper.getUser("lijiajie@ouc");
        System.out.println(user);
    }

}
