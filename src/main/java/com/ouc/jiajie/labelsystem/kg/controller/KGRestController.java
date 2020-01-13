package com.ouc.jiajie.labelsystem.kg.controller;


import com.ouc.jiajie.labelsystem.kg.service.KGService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;


@RestController
@RequestMapping("/api/kg")
public class KGRestController {

    @Autowired
    private KGService kgService;

    @RequestMapping(value = "/wordsegment", method = RequestMethod.POST)
    public @ResponseBody
    List<Map<String, String>> listFiles(@RequestBody Map<String, Object> lineStr) {
        String contents = (String)lineStr.get("contents");
        String words = (String)lineStr.get("entity");
        return kgService.wordSegment(contents, words);
    }

    @RequestMapping(value = "/addentity", method = RequestMethod.POST)
    public @ResponseBody
    String addEntities(@RequestBody Map<String, String> words) {
        String contents = words.get("entity");
        kgService.addEntity(contents);
        return "success";
    }
}