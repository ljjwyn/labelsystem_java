package com.ouc.jiajie.labelsystem.kg.entity;

public class labelSetting {
    private int id;
    private String labelName;
    private String labelDes;
    private int labelFlag;

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getLabelFlag() {
        return labelFlag;
    }

    public String getLabelDes() {
        return labelDes;
    }

    public String getLabelName() {
        return labelName;
    }

    public void setLabelDes(String labelDes) {
        this.labelDes = labelDes;
    }

    public void setLabelFlag(int labelFlag) {
        this.labelFlag = labelFlag;
    }

    public void setLabelName(String labelName) {
        this.labelName = labelName;
    }
}
