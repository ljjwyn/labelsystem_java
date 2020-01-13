package com.ouc.jiajie.labelsystem.kg.mapper;
import com.ouc.jiajie.labelsystem.kg.entity.labelSetting;
import org.apache.ibatis.annotations.*;
import org.springframework.stereotype.Component;

import java.util.List;

@Mapper
@Component
public interface LabelSettingMapper {

    @Select("SELECT * FROM webAlgorithm.labelSetting")
    List<labelSetting> getAllLabelSetting();

    @Insert("INSERT IGNORE into webAlgorithm.labelSetting(labelName, labelDes, labelFlag) " +
            "VALUES (#{labelSetting.labelName}, #{labelSetting.labelDes},#{labelSetting.labelFlag})")
    void createASetting(@Param("labelSetting") labelSetting labelsetting);


    @Delete("DELETE FROM webAlgorithm.labelSetting WHERE id = #{labelId}")
    void deleteSetting(@Param("labelId") int labelId);


}
