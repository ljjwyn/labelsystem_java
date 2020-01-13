package com.ouc.jiajie.labelsystem.kg.controller;

import com.ouc.jiajie.labelsystem.kg.entity.labelSetting;
import com.ouc.jiajie.labelsystem.kg.mapper.LabelSettingMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/kg")
public class KGViewController {

    @Autowired
    private LabelSettingMapper LabelSettingMapper;

    @RequestMapping(value = "/insert", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> insertSetting(@RequestBody Map<String, Object> resquestParams) throws Exception {
        //Map<String, Object> resquestParams = JSONObject.parseObject(str, Map.class);
        labelSetting labelsetting=confParams(resquestParams);
        System.out.println(labelsetting);
        LabelSettingMapper.createASetting(labelsetting);
        Map<String,String> res = new HashMap<>();
        res.put("state", "success");
        return res;
    }


    @RequestMapping(value = "/getallsetting", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.GET)
    @ResponseBody
    public List<labelSetting> getAllTask(){
        List<labelSetting> labelSettingList;
        labelSettingList=LabelSettingMapper.getAllLabelSetting();
        System.out.println(labelSettingList);
        return labelSettingList;
    }


    @RequestMapping(value = "/delete", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> deleteSql(@RequestBody Map<String, Integer> resquestParams) throws Exception {
        int uid=resquestParams.get("id");
        System.out.println(resquestParams);
        LabelSettingMapper.deleteSetting(uid);
        Map<String,String> res = new HashMap<>();
        res.put("state","delete success");
        return res;
    }



    public labelSetting confParams(Map<String,Object> par){
        labelSetting labelsetting=new labelSetting();
        labelsetting.setLabelName((String)par.get("labelName"));
        labelsetting.setLabelDes((String)par.get("labelDes"));
        labelsetting.setLabelFlag(Integer.parseInt(par.get("labelFlag").toString()));
        return labelsetting;
    }
}