package com.ouc.jiajie.labelsystem.kg.controller;

import com.ouc.jiajie.labelsystem.kg.config.WebSecurityConfig;
import com.ouc.jiajie.labelsystem.kg.entity.userManagement;
import com.ouc.jiajie.labelsystem.kg.mapper.UserManagementMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;


@Controller
public class loginController {

    @Autowired
    private UserManagementMapper userManagementMapper;

    @GetMapping("/")
    public String index(@SessionAttribute(WebSecurityConfig.SESSION_KEY) String account, Model model) {
        model.addAttribute("name", account);
        return "index.html";
    }

    @GetMapping("/login")
    public String login() {
        return "login.html";
    }

    @PostMapping("/loginPost")
    @ResponseBody
    public Map<String, Object> loginPost(String account, String password, HttpSession session) {
        Map<String, Object> map = new HashMap<>();
        try {
            userManagement userInfo=userManagementMapper.getUser(account);
            if (!password.equals(userInfo.getPassword())) {
                map.put("success", false);
                map.put("message", "密码错误");
                return map;
            }else {
                // 设置session
                session.setAttribute(WebSecurityConfig.SESSION_KEY, account);
                map.put("success", true);
                map.put("message", "登录成功");
                map.put("userId",userInfo.getUserId());
                map.put("userName",userInfo.getUserName());
                return map;
            }
        }catch (Exception e){
            map.put("success", false);
            map.put("message", "账户不存在");
            return map;
        }

    }
    @RequestMapping(value = "/register", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> register(@RequestBody Map<String, Object> resquestParams) throws Exception {
        userManagement newUser = new userManagement();
        newUser.setUserName((String)resquestParams.get("userName"));
        newUser.setUserEamil((String)resquestParams.get("userEmail"));
        newUser.setPassword((String)resquestParams.get("password"));
        userManagementMapper.createAUser(newUser);
        Map<String,String> res = new HashMap<>();
        res.put("state","success");
        return res;
    }


    @RequestMapping(value = "/getuserinfo", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public userManagement getUserInfo(@RequestBody Map<String, Integer> resquestParams) throws Exception {
        userManagement newUser = userManagementMapper.getUserInfo(resquestParams.get("userId"));
        return newUser;
    }


    @RequestMapping(value = "/updateinfo", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String, String> updateInfo(@RequestBody Map<String, Object> resquestParams) throws Exception {
        userManagementMapper.updateUserInfo((String)resquestParams.get("phoneNum"), (String)resquestParams.get("userDes"), Integer.parseInt((String)resquestParams.get("userId")));
        Map<String,String> res = new HashMap<>();
        res.put("state","success");
        return res;
    }


    @GetMapping("/logout")
    public String logout(HttpSession session) {
        // 移除session
        session.removeAttribute(WebSecurityConfig.SESSION_KEY);
        return "redirect:login.html";
    }
}
