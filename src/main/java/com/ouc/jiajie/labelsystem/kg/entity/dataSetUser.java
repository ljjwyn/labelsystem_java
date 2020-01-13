package com.ouc.jiajie.labelsystem.kg.entity;

public class dataSetUser {
    private int id;
    private int userId;
    private int dataSetId;
    private Double labelRate;
    private int labeledNum;
    private int sumLabeledNum;

    public void setUserId(int userId) {
        this.userId = userId;
    }

    public int getUserId() {
        return userId;
    }

    public void setLabelRate(Double labelRate) {
        this.labelRate = labelRate;
    }

    public void setLabeledNum(int labeledNum) {
        this.labeledNum = labeledNum;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getLabeledNum() {
        return labeledNum;
    }

    public Double getLabelRate() {
        return labelRate;
    }

    public int getDataSetId() {
        return dataSetId;
    }

    public void setDataSetId(int dataSetId) {
        this.dataSetId = dataSetId;
    }

    public int getSumLabeledNum() {
        return sumLabeledNum;
    }

    public void setSumLabeledNum(int sumLabeledNum) {
        this.sumLabeledNum = sumLabeledNum;
    }
}
