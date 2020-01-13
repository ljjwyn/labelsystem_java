package com.ouc.jiajie.labelsystem.kg.entity;

public class labelDataSet {
    private int id;
    private String dataSetName;
    private String dataSetDes;
    private String dataSetColName;
    private int dataSetNum;
    private int labeledNum;
    private Double labelRate;

    public int getLabeledNum() {
        return labeledNum;
    }

    public void setLabeledNum(int labeledNum) {
        this.labeledNum = labeledNum;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getId() {
        return id;
    }

    public String getDataSetName() {
        return dataSetName;
    }

    public void setDataSetName(String dataSetName) {
        this.dataSetName = dataSetName;
    }

    public Double getLabelRate() {
        return labelRate;
    }

    public int getDataSetNum() {
        return dataSetNum;
    }

    public String getDataSetColName() {
        return dataSetColName;
    }

    public String getDataSetDes() {
        return dataSetDes;
    }

    public void setDataSetColName(String dataSetColName) {
        this.dataSetColName = dataSetColName;
    }

    public void setDataSetDes(String dataSetDes) {
        this.dataSetDes = dataSetDes;
    }

    public void setDataSetNum(int dataSetNum) {
        this.dataSetNum = dataSetNum;
    }

    public void setLabelRate(Double labelRate) {
        this.labelRate = labelRate;
    }
}
