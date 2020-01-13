package com.ouc.jiajie.labelsystem.kg.entity;

public class userManagement {
    private int userId;
    private String userName;
    private String userEmail;
    private String password;
    private String phoneNum;
    private String userDes;

    public String getPhoneNum() {
        return phoneNum;
    }

    public String getUserDes() {
        return userDes;
    }

    public void setPhoneNum(String phoneNum) {
        this.phoneNum = phoneNum;
    }

    public void setUserDes(String userDes) {
        this.userDes = userDes;
    }

    public int getUserId() {
        return userId;
    }

    public String getPassword() {
        return password;
    }

    public String getUserEamil() {
        return userEmail;
    }

    public String getUserName() {
        return userName;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setUserEamil(String userEamil) {
        this.userEmail = userEamil;
    }

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}
