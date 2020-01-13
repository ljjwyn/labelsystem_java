package com.ouc.jiajie.labelsystem.kg.mapper;

import com.ouc.jiajie.labelsystem.kg.entity.labelDataSet;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface LabelDataSetMapper {
    @Select("SELECT * FROM webAlgorithm.labelDataSet")
    List<labelDataSet> getAllLabelDataSet();

    @Select("SELECT dataSetNum FROM webAlgorithm.labelDataSet WHERE id=#{ID}")
    int getDataSetNum(@Param("ID")int ID);

    @Select("SELECT labeledNum FROM webAlgorithm.labelDataSet WHERE id=#{ID}")
    int getLabeledNum(@Param("ID")int ID);

    @Update("UPDATE webAlgorithm.labelDataSet SET labeledNum=#{labeledNum} WHERE id=#{ID}")
    void updateLabeledNum(@Param("labeledNum")int labeledNum, @Param("ID")int ID);

    @Update("UPDATE webAlgorithm.labelDataSet SET labelRate=#{labelRate} WHERE id=#{ID}")
    void updateDataSetName(@Param("labelRate")Double labelRate, @Param("ID")int ID);
}
