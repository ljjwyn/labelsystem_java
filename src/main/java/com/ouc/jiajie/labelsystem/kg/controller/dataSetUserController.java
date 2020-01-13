package com.ouc.jiajie.labelsystem.kg.controller;


import com.ouc.jiajie.labelsystem.kg.entity.dataSetUser;
import com.ouc.jiajie.labelsystem.kg.entity.labelDataSet;
import com.ouc.jiajie.labelsystem.kg.mapper.DataSetUserMapper;
import com.ouc.jiajie.labelsystem.kg.mapper.LabelDataSetMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/datasetuser")
public class dataSetUserController {
    @Autowired
    private LabelDataSetMapper labelDataSetMapper;

    @Autowired
    private DataSetUserMapper dataSetUserMapper;

    @RequestMapping(value = "/initrecord", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public String initRecord(@RequestBody Map<String, Integer> resquestParams){
        dataSetUserMapper.updateLabeledNum(0, resquestParams.get("userId"), resquestParams.get("dataSetId"));
        dataSetUserMapper.updateLabeledNum(0, resquestParams.get("userId"), resquestParams.get("dataSetId"));
        dataSetUserMapper.updateDataSetName(0.0, resquestParams.get("userId"), resquestParams.get("dataSetId"));
        return "success";
    }

    @RequestMapping(value = "/logoutinit", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public Map<String,String> logoutInit(@RequestBody Map<String, Integer> resquestParams){
        List<labelDataSet> dataSetIdList=labelDataSetMapper.getAllLabelDataSet();
        for(int i=0;i<dataSetIdList.size();i++){
            dataSetUserMapper.updateLabeledNum(0, resquestParams.get("userId"), dataSetIdList.get(i).getId());
        }
        Map<String,String> res = new HashMap<>();
        res.put("state","success");
        return res;
    }

    @RequestMapping(value = "/getdatasetinfo", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public dataSetUser getDataSetInfo(@RequestBody Map<String, Integer> resquestParams){
        dataSetUser datasetUser = dataSetUserMapper.getDataSetInfo(resquestParams.get("userId"), resquestParams.get("dataSetId"));
        return datasetUser;
    }

    @RequestMapping(value = "/getsumlabelednum", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public int getsumlabelednum(@RequestBody Map<String, Integer> resquestParams){
        List<Integer> labeledSumNum = dataSetUserMapper.getASumLabeledNum(resquestParams.get("userId"));
        int sum=0;
        for(int i=0;i<labeledSumNum.size();i++){
            sum+=labeledSumNum.get(i);
        }
        return sum;
    }

    @RequestMapping(value = "/getlabelednum", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public int getlabelednum(@RequestBody Map<String, Integer> resquestParams){
        List<Integer> labeledNum = dataSetUserMapper.getALabeledNum(resquestParams.get("userId"));
        int sum=0;
        for(int i=0;i<labeledNum.size();i++){
            sum+=labeledNum.get(i);
        }
        return sum;
    }

    @RequestMapping(value = "/updatenum", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public String updateNum(@RequestBody Map<String, Integer> resquestParams){
        int totelNum=labelDataSetMapper.getDataSetNum(resquestParams.get("dataSetId"));
        int labeledNum=dataSetUserMapper.getLabeledNum(resquestParams.get("userId"), resquestParams.get("dataSetId"));
        int sumLabeledNum=dataSetUserMapper.getSumLabeledNum(resquestParams.get("userId"), resquestParams.get("dataSetId"));
        labeledNum++;
        sumLabeledNum++;
        Double labelRate=(double)sumLabeledNum/totelNum;
        System.out.println(labelRate);
        dataSetUserMapper.updateLabeledNum(labeledNum, resquestParams.get("userId"), resquestParams.get("dataSetId"));
        dataSetUserMapper.updateSumLabeledNum(sumLabeledNum, resquestParams.get("userId"), resquestParams.get("dataSetId"));
        dataSetUserMapper.updateDataSetName(labelRate, resquestParams.get("userId"), resquestParams.get("dataSetId"));
        return "success";
    }

    @RequestMapping(value = "/insertrecord", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public String insertRecord(@RequestBody Map<String, Integer> resquestParams){
        dataSetUser datasetUser = new dataSetUser();
        datasetUser.setUserId(resquestParams.get("userId"));
        datasetUser.setDataSetId(resquestParams.get("dataSetId"));
        datasetUser.setLabeledNum(0);
        datasetUser.setSumLabeledNum(0);
        datasetUser.setLabelRate(0.0);
        dataSetUserMapper.createARecord(datasetUser);
        return "success";
    }
}
