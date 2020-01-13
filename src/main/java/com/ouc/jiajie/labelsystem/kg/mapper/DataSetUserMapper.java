package com.ouc.jiajie.labelsystem.kg.mapper;

import com.ouc.jiajie.labelsystem.kg.entity.dataSetUser;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface DataSetUserMapper {

    @Select("SELECT * FROM webAlgorithm.labelDataSet")
    List<dataSetUser> getAllDataSetUser();

    @Insert("INSERT IGNORE into webAlgorithm.dataSetUser(userId, dataSetId, labelRate, labeledNum, " +
            "sumLabeledNum) VALUES (#{dataSetUser.userId}, #{dataSetUser.dataSetId}, #{dataSetUser.labelRate}" +
            ", #{dataSetUser.labeledNum}, #{dataSetUser.sumLabeledNum})")
    void createARecord(@Param("dataSetUser") dataSetUser datasetUser);

    @Update("UPDATE webAlgorithm.dataSetUser SET labeledNum=#{labeledNum} WHERE userId=#{userId} AND dataSetId=#{dataSetId}")
    void updateLabeledNum(@Param("labeledNum")int labeledNum, @Param("userId")int userId, @Param("dataSetId")int dataSetId);

    @Update("UPDATE webAlgorithm.dataSetUser SET sumLabeledNum=#{sumLabeledNum} WHERE userId=#{userId} AND dataSetId=#{dataSetId}")
    void updateSumLabeledNum(@Param("sumLabeledNum")int sumLabeledNum, @Param("userId")int userId, @Param("dataSetId")int dataSetId);

    @Update("UPDATE webAlgorithm.dataSetUser SET labelRate=#{labelRate} WHERE userId=#{userId} AND dataSetId=#{dataSetId}")
    void updateDataSetName(@Param("labelRate")Double labelRate, @Param("userId")int userId, @Param("dataSetId")int dataSetId);

    @Select("SELECT labeledNum FROM webAlgorithm.dataSetUser WHERE userId=#{userId} AND dataSetId=#{dataSetId}")
    int getLabeledNum(@Param("userId")int userId, @Param("dataSetId")int dataSetId);

    @Select("SELECT labeledNum FROM webAlgorithm.dataSetUser WHERE userId=#{userId}")
    List<Integer> getALabeledNum(@Param("userId")int userId);

    @Select("SELECT sumLabeledNum FROM webAlgorithm.dataSetUser WHERE userId=#{userId}")
    List<Integer> getASumLabeledNum(@Param("userId")int userId);

    @Select("SELECT sumLabeledNum FROM webAlgorithm.dataSetUser WHERE userId=#{userId} AND dataSetId=#{dataSetId}")
    Integer getSumLabeledNum(@Param("userId")int userId, @Param("dataSetId")int dataSetId);

    @Select("SELECT labelRate FROM webAlgorithm.dataSetUser WHERE userId=#{userId} AND dataSetId=#{dataSetId}")
    Double getLabelRate(@Param("userId")int userId, @Param("dataSetId")int dataSetId);

    @Select("SELECT * FROM webAlgorithm.dataSetUser WHERE userId=#{userId} AND dataSetId=#{dataSetId}")
    dataSetUser getDataSetInfo(@Param("userId")int userId, @Param("dataSetId")int dataSetId);
}
