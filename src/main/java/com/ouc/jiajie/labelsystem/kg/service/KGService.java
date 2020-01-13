package com.ouc.jiajie.labelsystem.kg.service;

import com.hankcs.hanlp.HanLP;
import com.hankcs.hanlp.dictionary.CustomDictionary;
import com.hankcs.hanlp.seg.Segment;
import com.hankcs.hanlp.seg.common.Term;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class KGService {

    public KGService() {

    }

    public void addEntity(String word){
        /**
         * 自定义分词+词性
         */
        CustomDictionary.add(word, "sd 0");
        CustomDictionary.add("老鼠疮", "sd 0");
        CustomDictionary.add("鼠疬", "sd 0");
        CustomDictionary.add("知识图谱", "sd 0");
    }

    public List<Map<String, String>> wordSegment(String lineStr, String words) {

        List<Map<String, String>> termList = new ArrayList<>();

        try {
            Segment segment = HanLP.newSegment();
            segment.enableCustomDictionary(true);
            CustomDictionary.add(words, "sd 0");
            List<Term> seg = segment.seg(lineStr);
            for (Term term : seg) {
                System.out.println(term.toString());
                Map<String, String> mTerm = new HashMap<>();
                mTerm.put("word", term.word);
                mTerm.put("isSelect", "0");
                mTerm.put("nature", term.nature.name());
                termList.add(mTerm);

            }
        } catch (Exception ex) {
            System.out.println(ex.getClass() + "," + ex.getMessage());
        }

        return termList;
    }
    }