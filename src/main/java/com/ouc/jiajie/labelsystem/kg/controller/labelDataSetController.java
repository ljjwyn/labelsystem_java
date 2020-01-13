package com.ouc.jiajie.labelsystem.kg.controller;

import com.ouc.jiajie.labelsystem.kg.entity.labelDataSet;
import com.ouc.jiajie.labelsystem.kg.mapper.DataSetUserMapper;
import com.ouc.jiajie.labelsystem.kg.mapper.LabelDataSetMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/labeldataset")
public class labelDataSetController {
    @Autowired
    private LabelDataSetMapper labelDataSetMapper;

    @Autowired
    private DataSetUserMapper dataSetUserMapper;

    @RequestMapping(value = "/getalldataset", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public List<labelDataSet> getAllTask(@RequestBody Map<String, Integer> resquestParams){
        List<labelDataSet> labelDataSetList;
        labelDataSetList=labelDataSetMapper.getAllLabelDataSet();
        for(int i=0;i<labelDataSetList.size();i++){
            Integer labeledNum=dataSetUserMapper.getSumLabeledNum(resquestParams.get("userId"), labelDataSetList.get(i).getId());
            Double labelRate=dataSetUserMapper.getLabelRate(resquestParams.get("userId"), labelDataSetList.get(i).getId());
            if(labeledNum!=null){
                labelDataSetList.get(i).setLabeledNum(labeledNum);
                labelDataSetList.get(i).setLabelRate(labelRate);
            }else {
                labelDataSetList.get(i).setLabeledNum(0);
                labelDataSetList.get(i).setLabelRate(0.0);
            }
        }
        System.out.println(labelDataSetList);
        return labelDataSetList;
    }


    @RequestMapping(value = "/recordrate", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public String recordRate(@RequestBody Map<String, Integer> resquestParams){
        int totelNum=labelDataSetMapper.getDataSetNum(resquestParams.get("id"));
        int labeledNum=labelDataSetMapper.getLabeledNum(resquestParams.get("id"));
        labeledNum++;
        labelDataSetMapper.updateLabeledNum(labeledNum, resquestParams.get("id"));
        System.out.println(labeledNum);
        System.out.println(totelNum);
        Double labelRate=(double)labeledNum/totelNum;
        System.out.println(labelRate);
        labelDataSetMapper.updateDataSetName(labelRate, resquestParams.get("id"));
        return "success";
    }


    @RequestMapping(value = "/initrecord", produces = {"application/json;charset=UTF-8"}, method = RequestMethod.POST)
    @ResponseBody
    public String initRecord(@RequestBody Map<String, Integer> resquestParams){
        labelDataSetMapper.updateLabeledNum(0, resquestParams.get("id"));
        labelDataSetMapper.updateDataSetName(0.0, resquestParams.get("id"));
        return "success";
    }

    /**
     * 构建标注数据集下载
     * @return
     */

//    @RequestMapping(value = "/downExcel", method = RequestMethod.GET, produces = "application/json;charset=UTF-8")
//    @ResponseBody
//    public String downExcel(HttpServletResponse response) throws UnsupportedEncodingException {
//        LocalDate end = LocalDate.now();
//        LocalDate start = end.minusDays(14);
//        String filename = "RETrain";
//        String filepath = "/home/jiajie/test/data/download/" + filename;
//        // writeExcelFile(start, end, filepath);
//        // 如果文件名不为空，则进行下载
//        if (filename != null) {
//            File file = new File(filepath);
//            // 如果文件存在，则进行下载
//            if (file.exists()) {
//                // 配置文件下载
//                response.setHeader("content-type", "application/octet-stream");
//                response.setContentType("application/octet-stream");
//                // 下载文件能正常显示中文
//                response.setHeader("Content-Disposition", "attachment;filename=" + URLEncoder.encode(filename, "UTF-8"));
//                // 实现文件下载
//                byte[] buffer = new byte[1024];
//                FileInputStream fis = null;
//                BufferedInputStream bis = null;
//                try {
//                    fis = new FileInputStream(file);
//                    bis = new BufferedInputStream(fis);
//                    OutputStream os = response.getOutputStream();
//                    int i = bis.read(buffer);
//                    while (i != -1) {
//                        os.write(buffer, 0, i);
//                        i = bis.read(buffer);
//                    }
//                    System.out.println("Download  successfully!");
//                    return "successfully";
//
//                } catch (Exception e) {
//                    System.out.println("Download  failed!");
//                    return "failed";
//
//                } finally {
//                    if (bis != null) {
//                        try {
//                            bis.close();
//                        } catch (IOException e) {
//                            e.printStackTrace();
//                        }
//                    }
//                    if (fis != null) {
//                        try {
//                            fis.close();
//                        } catch (IOException e) {
//                            e.printStackTrace();
//                        }
//                    }
//                }
//            }
//        }
//        return "";
//    }

    //文件下载相关代码
    @RequestMapping("/download")
    public String downloadFile(HttpServletRequest request, HttpServletResponse response, String aClass) {
        String fileName="RETrain";
        downloadMethod(response, fileName);
        return null;
    }

    private void downloadMethod(HttpServletResponse response, String fileName) {
        if (fileName != null) {
            //设置文件路径
            String realPath = "/home/jiajie/test/data/download/";
            //String realPath = "/home/hadoop/temp/labelSystem/";
            File file = new File(realPath , fileName);
            if (file.exists()) {
                response.setContentType("application/force-download");// 设置强制下载不打开
                response.addHeader("Content-Disposition", "attachment;fileName=" + fileName);// 设置文件名
                byte[] buffer = new byte[1024];
                FileInputStream fis = null;
                BufferedInputStream bis = null;
                try {
                    fis = new FileInputStream(file);
                    bis = new BufferedInputStream(fis);
                    OutputStream os = response.getOutputStream();
                    int i = bis.read(buffer);
                    while (i != -1) {
                        os.write(buffer, 0, i);
                        i = bis.read(buffer);
                    }
                    System.out.println("success");
                } catch (Exception e) {
                    e.printStackTrace();
                } finally {
                    if (bis != null) {
                        try {
                            bis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                    if (fis != null) {
                        try {
                            fis.close();
                        } catch (IOException e) {
                            e.printStackTrace();
                        }
                    }
                }
            }
        }
    }

    //文件下载相关代码
    @RequestMapping("/downloadclass")
    public String downloadClass(HttpServletRequest request, HttpServletResponse response) {
        String fileName="Class";
        downloadMethod(response, fileName);
        return null;
    }

}
