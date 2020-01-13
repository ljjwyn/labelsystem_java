package com.ouc.jiajie.labelsystem.kg.mapper;

import com.ouc.jiajie.labelsystem.kg.entity.userManagement;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface UserManagementMapper {
    @Select("SELECT * FROM webAlgorithm.userManagement")
    List<userManagement> getAllUser();

    @Select("SELECT * FROM webAlgorithm.userManagement WHERE userEmail=#{userEmail}")
    userManagement getUser(@Param("userEmail") String userEmail);

    @Select("SELECT * FROM webAlgorithm.userManagement WHERE userId=#{userId}")
    userManagement getUserInfo(@Param("userId") int userId);

    @Insert("INSERT IGNORE into webAlgorithm.userManagement(userName, userEmail, password) " +
            "VALUES (#{userManagement.userName}, #{userManagement.userEmail},#{userManagement.password})")
    void createAUser(@Param("userManagement") userManagement usermanagement);

    @Delete("DELETE FROM webAlgorithm.userManagement WHERE userId = #{userId}")
    void deleteUser(@Param("userId") int userId);

    @Update("UPDATE webAlgorithm.userManagement SET phoneNum=#{phoneNum}, userDes=#{userDes} WHERE userId=#{userId}")
    void updateUserInfo(@Param("phoneNum")String phoneNum, @Param("userDes")String userDes, @Param("userId")int userId);
}
