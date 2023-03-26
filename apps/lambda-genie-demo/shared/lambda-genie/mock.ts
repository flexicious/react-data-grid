export const mockConfig =  
{
  "ruleSets": [
    {
      "entityName": "UserProfile",
      "rules": [
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "number",
                  "dataField": "age",
                  "headerText": "age",
                  "filterOptions": {
                    "filterOperation": "Between",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "age"
                },
                "parent": null,
                "id": "1.1",
                "expression": "20",
                "operation": "LessThan"
              },
              {
                "col": {
                  "format": "string",
                  "dataField": "gender",
                  "headerText": "gender",
                  "filterOptions": {
                    "filterComboBoxBuildFromGrid": true,
                    "filterComboBoxDataProvider": [
                      {
                        "name": "Male",
                        "value": "Male"
                      },
                      {
                        "name": "Female",
                        "value": "Female"
                      }
                    ],
                    "filterOperation": "InList",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "gender"
                },
                "parent": null,
                "id": "1.2",
                "expression": [
                  "Male"
                ],
                "operation": "InList"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "string",
            "value": "Boys"
          },
          "filterString": "If (age Less Than 20\nAND gender In List Male) then return Boys"
        },
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "number",
                  "dataField": "age",
                  "headerText": "age",
                  "filterOptions": {
                    "filterOperation": "Between",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "age"
                },
                "parent": null,
                "id": "1.1",
                "expression": "20",
                "operation": "LessThan"
              },
              {
                "col": {
                  "format": "string",
                  "dataField": "gender",
                  "headerText": "gender",
                  "filterOptions": {
                    "filterComboBoxBuildFromGrid": true,
                    "filterComboBoxDataProvider": [
                      {
                        "name": "Male",
                        "value": "Male"
                      },
                      {
                        "name": "Female",
                        "value": "Female"
                      }
                    ],
                    "filterOperation": "InList",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "gender"
                },
                "parent": null,
                "id": "1.2",
                "expression": [
                  "Female"
                ],
                "operation": "InList"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "string",
            "value": "Girls"
          },
          "filterString": "If (age Less Than 20\nAND gender In List Female) then return Girls"
        },
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "string",
                  "dataField": "gender",
                  "headerText": "gender",
                  "filterOptions": {
                    "filterComboBoxBuildFromGrid": true,
                    "filterComboBoxDataProvider": [
                      {
                        "name": "Male",
                        "value": "Male"
                      },
                      {
                        "name": "Female",
                        "value": "Female"
                      }
                    ],
                    "filterOperation": "InList",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "gender"
                },
                "parent": null,
                "id": "1.1",
                "expression": [
                  "Female"
                ],
                "operation": "InList"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "string",
            "value": "Women"
          },
          "filterString": "If (gender In List Female) then return Women"
        },
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "string",
                  "dataField": "gender",
                  "headerText": "gender",
                  "filterOptions": {
                    "filterComboBoxBuildFromGrid": true,
                    "filterComboBoxDataProvider": [
                      {
                        "name": "Male",
                        "value": "Male"
                      },
                      {
                        "name": "Female",
                        "value": "Female"
                      }
                    ],
                    "filterOperation": "InList",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "gender"
                },
                "parent": null,
                "id": "1.1",
                "expression": [
                  "Male"
                ],
                "operation": "InList"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "string",
            "value": "Men"
          },
          "filterString": "If (gender In List Male) then return Men"
        }
      ],
      "name": "HOME_PAGE_PERSONALIZATION"
    },
    {
      "entityName": "UserProfile",
      "rules": [
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "string",
                  "dataField": "email",
                  "headerText": "email",
                  "filterOptions": {
                    "filterOperation": "Wildcard",
                    "filterWaterMark": "*Search*",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "email"
                },
                "parent": null,
                "id": "1.1",
                "expression": "BETA_FEATURE_USERS",
                "operation": "InPredefinedList"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "boolean",
            "value": true
          },
          "filterString": "If (email In Predefined List BETA_FEATURE_USERS) then return true"
        }
      ],
      "name": "NEXT_GEN_FEATURE",
      "versions": {
        "dev": [
          {
            "matcher": {
              "logicalOperator": "AND",
              "children": [
                {
                  "col": {
                    "format": "string",
                    "dataField": "email",
                    "headerText": "email",
                    "filterOptions": {
                      "filterOperation": "Wildcard",
                      "filterWaterMark": "*Search*",
                      "filterExcludeObjectsWithoutMatchField": true
                    },
                    "uniqueIdentifier": "email"
                  },
                  "parent": null,
                  "id": "1.1",
                  "expression": "*",
                  "operation": "Wildcard"
                }
              ],
              "id": "1"
            },
            "result": {
              "type": "boolean",
              "value": true
            },
            "filterString": "If (email Wildcard *) then return true"
          }
        ]
      }
    },
    {
      "entityName": "SchoolInfo",
      "rules": [
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "number",
                  "dataField": "PercentEligibleFreeK12",
                  "headerText": "PercentEligibleFreeK12",
                  "filterOptions": {
                    "filterOperation": "Between",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "PercentEligibleFreeK12"
                },
                "parent": null,
                "expression": 0.1,
                "id": "1.1",
                "operation": "GreaterThan"
              },
              {
                "col": {
                  "format": "number",
                  "dataField": "PercentEligibleFreeK12",
                  "headerText": "PercentEligibleFreeK12",
                  "filterOptions": {
                    "filterOperation": "Between",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "PercentEligibleFreeK12"
                },
                "parent": null,
                "expression": 0.5,
                "id": "1.2",
                "operation": "LessThan"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "string",
            "value": "#ff6666"
          },
          "filterString": "If (PercentEligibleFreeK12 Greater Than 0.1\nAND PercentEligibleFreeK12 Less Than 0.5) then return #ff6666"
        },
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "number",
                  "dataField": "PercentEligibleFreeK12",
                  "headerText": "PercentEligibleFreeK12",
                  "filterOptions": {
                    "filterOperation": "Between",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "PercentEligibleFreeK12"
                },
                "parent": null,
                "expression": "0.5",
                "id": "1.1",
                "operation": "GreaterThanEquals"
              },
              {
                "col": {
                  "format": "number",
                  "dataField": "PercentEligibleFreeK12",
                  "headerText": "PercentEligibleFreeK12",
                  "filterOptions": {
                    "filterOperation": "Between",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "PercentEligibleFreeK12"
                },
                "parent": null,
                "expression": "0.75",
                "id": "1.2",
                "operation": "LessThan"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "string",
            "value": "#ffbbbb"
          },
          "filterString": "If (PercentEligibleFreeK12 Greater Than Equals 0.5\nAND PercentEligibleFreeK12 Less Than 0.75) then return #ffbbbb"
        },
        {
          "matcher": {
            "logicalOperator": "AND",
            "children": [
              {
                "col": {
                  "format": "number",
                  "dataField": "PercentEligibleFreeK12",
                  "headerText": "PercentEligibleFreeK12",
                  "filterOptions": {
                    "filterOperation": "Between",
                    "filterExcludeObjectsWithoutMatchField": true
                  },
                  "uniqueIdentifier": "PercentEligibleFreeK12"
                },
                "parent": null,
                "expression": "0.75",
                "id": "1.1",
                "operation": "GreaterThanEquals"
              }
            ],
            "id": "1"
          },
          "result": {
            "type": "string",
            "value": "#66ff66"
          },
          "filterString": "If (PercentEligibleFreeK12 Greater Than Equals 0.75) then return #66ff66"
        }
      ],
      "name": "SCHOOL_ROW_COLOR"
    }
  ],
  "globalConfigs": [
    {
      "value": "{\n  \"value\": \"INFO\"\n}",
      "name": "LOG_LEVEL",
      "type": "StaticValue"
    }
  ],
  "lambdaConfigs": [
    {
      "name": "GET_PRODUCTS",
      "configValues": [
        {
          "name": "SLOT_NAMES",
          "type": "HOMEPAGE_SLOT_DETAILS",
          "value": "{\n  \"slot1\": \"Hobbies\",\n  \"slot2\": \"Clothing, Shoes & Jewelry\",\n  \"slot3\": \"Learning & Education\",\n  \"slot4\": \"Home & Kitchen\",\n  \"maxProducts\": 5\n}"
        },
        {
          "name": "FEATURED_PRODUCTS",
          "type": "FEATURED_PRODUCTS",
          "value": "[\n  {\n    \"Id\": \"1\",\n    \"Product_Name\": \"VTech Scoop & Play Digger\",\n    \"Selling_Price\": 23.39,\n    \"Image\": \"https://images-na.ssl-images-amazon.com/images/I/51J74xuLipL.jpg\",\n    \"Discount_Percent\": 15,\n    \"Product_Url\": \"https://www.amazon.com/VTech-80-518600-Scoop-Play-Digger/dp/B07PTBVXCX\"\n  },\n  {\n    \"Id\": \"3\",\n    \"Product_Name\": \"HHIP 4902-0045 Hastings Triplet Magnifier, 10 x Power, 21 mm Lens Diameter\",\n    \"Selling_Price\": 40.36,\n    \"Image\": \"https://images-na.ssl-images-amazon.com/images/I/41DtsdgvDRL.jpg\",\n    \"Discount_Percent\": 10,\n    \"Product_Url\": \"https://www.amazon.com/HHIP-4902-0045-Hastings-Magnifier-Diameter/dp/B01LW5FLSQ\"\n  },\n  {\n    \"Id\": \"4\",\n    \"Product_Name\": \"EuroGraphics Nasa Solar System 1000 Piece Puzzle\",\n    \"Selling_Price\": 19.09,\n    \"Image\": \"https://images-na.ssl-images-amazon.com/images/I/51Jq9C7inWL.jpg\",\n    \"Discount_Percent\": 5,\n    \"Product_Url\": \"https://www.amazon.com/EuroGraphics-Solar-System-Piece-Puzzle/dp/B001V9CMBO\"\n  },\n  {\n    \"Id\": \"5\",\n    \"Product_Name\": \"Fisher-Price Little People Noah's Ark, Frustration Free Packaging\",\n    \"Selling_Price\": 45.36,\n    \"Image\": \"https://images-na.ssl-images-amazon.com/images/I/51Lf27efZcL.jpg\",\n    \"Discount_Percent\": 10,\n    \"Product_Url\": \"https://www.amazon.com/Fisher-Price-Little-People-Noahs-Ark/dp/B00CQHYXOO\"\n  },\n  {\n    \"Id\": \"6\",\n    \"Product_Name\": \"LEGO City Garage Center 60232 Building Kit, New 2019 (234 Pieces)\",\n    \"Selling_Price\": 49.95,\n    \"Image\": \"https://images-na.ssl-images-amazon.com/images/I/51TQ-Xy6OsL.jpg\",\n    \"Discount_Percent\": 15,\n    \"Product_Url\": \"https://www.amazon.com/LEGO-Garage-Center-Building-Pieces/dp/B07PZQ133B\"\n  }\n]"
        }
      ]
    },
    {
      "name": "GET_SCHOOL_DETAILS",
      "configValues": [
        {
          "name": "GRID_DEFINITION",
          "type": "GRID_DEFINITION",
          "value": "{\n  \"enableColumnMenu\": true,\n  \"enableContextMenu\": true\n}"
        },
        {
          "name": "GRID_COLUMN_DEFINITION",
          "type": "GRID_COLUMN_DEFINITION",
          "value": "[\n  {\n    \"dataField\": \"schools.District\",\n    \"headerText\": \"District\",\n    \"uniqueIdentifier\": \"schools.District\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"*search*\",\n      \"filterOperation\": \"Wildcard\"\n    },\n    \"lockMode\": \"left\"\n  },\n  {\n    \"dataField\": \"schools.School\",\n    \"headerText\": \"School Name\",\n    \"uniqueIdentifier\": \"schools.School\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Contains\",\n      \"filterOperation\": \"Contains\"\n    },\n    \"lockMode\": \"left\"\n  },\n  {\n    \"dataField\": \"schools.CDSCode\",\n    \"headerText\": \"CDS Code\",\n    \"uniqueIdentifier\": \"schools.CDSCode\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    },\n    \"lockMode\": \"none\"\n  },\n  {\n    \"dataField\": \"schools.NCESDist\",\n    \"headerText\": \"NCES District\",\n    \"uniqueIdentifier\": \"schools.NCESDist\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"lockMode\": \"none\"\n  },\n  {\n    \"dataField\": \"schools.NCESSchool\",\n    \"headerText\": \"NCES School\",\n    \"uniqueIdentifier\": \"schools.NCESSchool\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"schools.StatusType\",\n    \"headerText\": \"Status\",\n    \"uniqueIdentifier\": \"schools.StatusType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.County\",\n    \"headerText\": \"County\",\n    \"uniqueIdentifier\": \"schools.County\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.Street\",\n    \"headerText\": \"Street\",\n    \"uniqueIdentifier\": \"schools.Street\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": false,\n    \"children\": [\n      {\n        \"dataField\": \"schools.StreetAbr\",\n        \"headerText\": \"Street Abr\",\n        \"uniqueIdentifier\": \"schools.StreetAbr\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterWaterMark\": \"Begins With\",\n          \"filterOperation\": \"BeginsWith\"\n        },\n        \"hidden\": true\n      },\n      {\n        \"dataField\": \"schools.City\",\n        \"headerText\": \"City\",\n        \"uniqueIdentifier\": \"schools.City\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterOperation\": \"InList\",\n          \"filterComboBoxBuildFromGrid\": true\n        },\n        \"hidden\": true\n      },\n      {\n        \"dataField\": \"schools.State\",\n        \"headerText\": \"State\",\n        \"uniqueIdentifier\": \"schools.State\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterWaterMark\": \"Begins With\",\n          \"filterOperation\": \"BeginsWith\"\n        },\n        \"hidden\": true\n      },\n      {\n        \"dataField\": \"schools.Zip\",\n        \"headerText\": \"Zip\",\n        \"uniqueIdentifier\": \"schools.Zip\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterWaterMark\": \"Begins With\",\n          \"filterOperation\": \"BeginsWith\"\n        },\n        \"hidden\": true\n      }\n    ]\n  },\n  {\n    \"dataField\": \"schools.MailStreet\",\n    \"headerText\": \"Mail Street\",\n    \"uniqueIdentifier\": \"schools.MailStreet\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": false,\n    \"children\": [\n      {\n        \"dataField\": \"schools.MailStrAbr\",\n        \"headerText\": \"Mail Str Abr\",\n        \"uniqueIdentifier\": \"schools.MailStrAbr\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterWaterMark\": \"Begins With\",\n          \"filterOperation\": \"BeginsWith\"\n        },\n        \"hidden\": true\n      },\n      {\n        \"dataField\": \"schools.MailCity\",\n        \"headerText\": \"Mail City\",\n        \"uniqueIdentifier\": \"schools.MailCity\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterWaterMark\": \"Begins With\",\n          \"filterOperation\": \"BeginsWith\"\n        },\n        \"hidden\": true\n      },\n      {\n        \"dataField\": \"schools.MailState\",\n        \"headerText\": \"Mail State\",\n        \"uniqueIdentifier\": \"schools.MailState\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterWaterMark\": \"Begins With\",\n          \"filterOperation\": \"BeginsWith\"\n        },\n        \"hidden\": true\n      },\n      {\n        \"dataField\": \"schools.MailZip\",\n        \"headerText\": \"Mail Zip\",\n        \"uniqueIdentifier\": \"schools.MailZip\",\n        \"format\": \"string\",\n        \"filterOptions\": {\n          \"filterWaterMark\": \"Begins With\",\n          \"filterOperation\": \"BeginsWith\"\n        },\n        \"hidden\": true\n      }\n    ]\n  },\n  {\n    \"dataField\": \"schools.Phone\",\n    \"headerText\": \"Phone\",\n    \"uniqueIdentifier\": \"schools.Phone\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.Ext\",\n    \"headerText\": \"Ext\",\n    \"uniqueIdentifier\": \"schools.Ext\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.Website\",\n    \"headerText\": \"Website\",\n    \"uniqueIdentifier\": \"schools.Website\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.OpenDate\",\n    \"headerText\": \"Open Date\",\n    \"uniqueIdentifier\": \"schools.OpenDate\",\n    \"format\": \"date\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.ClosedDate\",\n    \"headerText\": \"Closed Date\",\n    \"uniqueIdentifier\": \"schools.ClosedDate\",\n    \"format\": \"date\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.Charter\",\n    \"headerText\": \"Charter\",\n    \"uniqueIdentifier\": \"schools.Charter\",\n    \"format\": \"boolean\",\n    \"textAlign\": \"center\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Equals\",\n      \"filterComparisonType\": \"Boolean\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.CharterNum\",\n    \"headerText\": \"Charter Num\",\n    \"uniqueIdentifier\": \"schools.CharterNum\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.FundingType\",\n    \"headerText\": \"Funding Type\",\n    \"uniqueIdentifier\": \"schools.FundingType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.DOC\",\n    \"headerText\": \"DOC\",\n    \"uniqueIdentifier\": \"schools.DOC\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.DOCType\",\n    \"headerText\": \"DOC Type\",\n    \"uniqueIdentifier\": \"schools.DOCType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.SOC\",\n    \"headerText\": \"SOC\",\n    \"uniqueIdentifier\": \"schools.SOC\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.SOCType\",\n    \"headerText\": \"SOC Type\",\n    \"uniqueIdentifier\": \"schools.SOCType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.EdOpsCode\",\n    \"headerText\": \"Ed Ops Code\",\n    \"uniqueIdentifier\": \"schools.EdOpsCode\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.EdOpsName\",\n    \"headerText\": \"Ed Ops Name\",\n    \"uniqueIdentifier\": \"schools.EdOpsName\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.EILCode\",\n    \"headerText\": \"EIL Code\",\n    \"uniqueIdentifier\": \"schools.EILCode\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.EILName\",\n    \"headerText\": \"EIL Name\",\n    \"uniqueIdentifier\": \"schools.EILName\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.GSoffered\",\n    \"headerText\": \"G Soffered\",\n    \"uniqueIdentifier\": \"schools.GSoffered\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.GSserved\",\n    \"headerText\": \"G Sserved\",\n    \"uniqueIdentifier\": \"schools.GSserved\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.Virtual\",\n    \"headerText\": \"Virtual\",\n    \"uniqueIdentifier\": \"schools.Virtual\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"schools.Magnet\",\n    \"headerText\": \"Magnet\",\n    \"uniqueIdentifier\": \"schools.Magnet\",\n    \"format\": \"boolean\",\n    \"textAlign\": \"center\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Equals\",\n      \"filterComparisonType\": \"Boolean\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.Latitude\",\n    \"headerText\": \"Latitude\",\n    \"uniqueIdentifier\": \"schools.Latitude\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.Longitude\",\n    \"headerText\": \"Longitude\",\n    \"uniqueIdentifier\": \"schools.Longitude\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmFName1\",\n    \"headerText\": \"Adm F Name1\",\n    \"uniqueIdentifier\": \"schools.AdmFName1\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmLName1\",\n    \"headerText\": \"Adm L Name1\",\n    \"uniqueIdentifier\": \"schools.AdmLName1\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmEmail1\",\n    \"headerText\": \"Adm Email1\",\n    \"uniqueIdentifier\": \"schools.AdmEmail1\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmFName2\",\n    \"headerText\": \"Adm F Name2\",\n    \"uniqueIdentifier\": \"schools.AdmFName2\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmLName2\",\n    \"headerText\": \"Adm L Name2\",\n    \"uniqueIdentifier\": \"schools.AdmLName2\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmEmail2\",\n    \"headerText\": \"Adm Email2\",\n    \"uniqueIdentifier\": \"schools.AdmEmail2\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmFName3\",\n    \"headerText\": \"Adm F Name3\",\n    \"uniqueIdentifier\": \"schools.AdmFName3\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmLName3\",\n    \"headerText\": \"Adm L Name3\",\n    \"uniqueIdentifier\": \"schools.AdmLName3\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.AdmEmail3\",\n    \"headerText\": \"Adm Email3\",\n    \"uniqueIdentifier\": \"schools.AdmEmail3\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"schools.LastUpdate\",\n    \"headerText\": \"Last Update\",\n    \"uniqueIdentifier\": \"schools.LastUpdate\",\n    \"format\": \"date\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"frpm_new.AcademicYear\",\n    \"headerText\": \"Academic Year\",\n    \"uniqueIdentifier\": \"frpm_new.AcademicYear\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.CountyCode\",\n    \"headerText\": \"County Code\",\n    \"uniqueIdentifier\": \"frpm_new.CountyCode\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.DistrictCode\",\n    \"headerText\": \"District Code\",\n    \"uniqueIdentifier\": \"frpm_new.DistrictCode\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"frpm_new.SchoolCode\",\n    \"headerText\": \"School Code\",\n    \"uniqueIdentifier\": \"frpm_new.SchoolCode\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.CountyName\",\n    \"headerText\": \"County Name\",\n    \"uniqueIdentifier\": \"frpm_new.CountyName\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.DistrictName\",\n    \"headerText\": \"District Name\",\n    \"uniqueIdentifier\": \"frpm_new.DistrictName\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.SchoolName\",\n    \"headerText\": \"School Name\",\n    \"uniqueIdentifier\": \"frpm_new.SchoolName\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.DistrictType\",\n    \"headerText\": \"District Type\",\n    \"uniqueIdentifier\": \"frpm_new.DistrictType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.SchoolType\",\n    \"headerText\": \"School Type\",\n    \"uniqueIdentifier\": \"frpm_new.SchoolType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.EducationalOptionType\",\n    \"headerText\": \"Educational Option Type\",\n    \"uniqueIdentifier\": \"frpm_new.EducationalOptionType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.NSLPProvisionStatus\",\n    \"headerText\": \"NSLP Provision Status\",\n    \"uniqueIdentifier\": \"frpm_new.NSLPProvisionStatus\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.CharterSchoolYN\",\n    \"headerText\": \"Charter School YN\",\n    \"uniqueIdentifier\": \"frpm_new.CharterSchoolYN\",\n    \"format\": \"boolean\",\n    \"textAlign\": \"center\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Equals\",\n      \"filterComparisonType\": \"Boolean\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.CharterSchoolNumber\",\n    \"headerText\": \"Charter School Number\",\n    \"uniqueIdentifier\": \"frpm_new.CharterSchoolNumber\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"frpm_new.CharterFundingType\",\n    \"headerText\": \"Charter Funding Type\",\n    \"uniqueIdentifier\": \"frpm_new.CharterFundingType\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"frpm_new.IRC\",\n    \"headerText\": \"IRC\",\n    \"uniqueIdentifier\": \"frpm_new.IRC\",\n    \"format\": \"boolean\",\n    \"textAlign\": \"center\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Equals\",\n      \"filterComparisonType\": \"Boolean\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.LowGrade\",\n    \"headerText\": \"Low Grade\",\n    \"uniqueIdentifier\": \"frpm_new.LowGrade\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"frpm_new.HighGrade\",\n    \"headerText\": \"High Grade\",\n    \"uniqueIdentifier\": \"frpm_new.HighGrade\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"frpm_new.EnrollmentK12\",\n    \"headerText\": \"Enrollment K12\",\n    \"uniqueIdentifier\": \"frpm_new.EnrollmentK12\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.FreeMealCountK12\",\n    \"headerText\": \"Free Meal Count K12\",\n    \"uniqueIdentifier\": \"frpm_new.FreeMealCountK12\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.PercentEligibleFreeK12\",\n    \"headerText\": \"Percent Eligible Free K12\",\n    \"uniqueIdentifier\": \"frpm_new.PercentEligibleFreeK12\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.FRPMCountK12\",\n    \"headerText\": \"FRPM Count K12\",\n    \"uniqueIdentifier\": \"frpm_new.FRPMCountK12\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.PercentEligibleFRPMK12\",\n    \"headerText\": \"Percent Eligible FRPMK12\",\n    \"uniqueIdentifier\": \"frpm_new.PercentEligibleFRPMK12\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.EnrollmentAges517\",\n    \"headerText\": \"Enrollment Ages517\",\n    \"uniqueIdentifier\": \"frpm_new.EnrollmentAges517\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.FreeMealCountAges517\",\n    \"headerText\": \"Free Meal Count Ages517\",\n    \"uniqueIdentifier\": \"frpm_new.FreeMealCountAges517\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.PercentEligibleFreeAges517\",\n    \"headerText\": \"Percent Eligible Free Ages517\",\n    \"uniqueIdentifier\": \"frpm_new.PercentEligibleFreeAges517\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.FRPMCountAges517\",\n    \"headerText\": \"FRPM Count Ages517\",\n    \"uniqueIdentifier\": \"frpm_new.FRPMCountAges517\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"frpm_new.PercentEligibleFRPMAges517\",\n    \"headerText\": \"Percent Eligible FRPM Ages517\",\n    \"uniqueIdentifier\": \"frpm_new.PercentEligibleFRPMAges517\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    }\n  },\n  {\n    \"dataField\": \"satscores.cds\",\n    \"headerText\": \"Cds\",\n    \"uniqueIdentifier\": \"satscores.cds\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    },\n    \"hidden\": true\n  },\n  {\n    \"dataField\": \"satscores.rtype\",\n    \"headerText\": \"Rtype\",\n    \"uniqueIdentifier\": \"satscores.rtype\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterOperation\": \"InList\",\n      \"filterComboBoxBuildFromGrid\": true\n    }\n  },\n  {\n    \"dataField\": \"satscores.sname\",\n    \"headerText\": \"Sname\",\n    \"uniqueIdentifier\": \"satscores.sname\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"satscores.dname\",\n    \"headerText\": \"Dname\",\n    \"uniqueIdentifier\": \"satscores.dname\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"satscores.cname\",\n    \"headerText\": \"Cname\",\n    \"uniqueIdentifier\": \"satscores.cname\",\n    \"format\": \"string\",\n    \"filterOptions\": {\n      \"filterWaterMark\": \"Begins With\",\n      \"filterOperation\": \"BeginsWith\"\n    }\n  },\n  {\n    \"dataField\": \"satscores.enroll12\",\n    \"headerText\": \"Enroll12\",\n    \"uniqueIdentifier\": \"satscores.enroll12\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"formatterPrecision\": 0\n  },\n  {\n    \"dataField\": \"satscores.numTstTakr\",\n    \"headerText\": \"Num Tst Takr\",\n    \"uniqueIdentifier\": \"satscores.numTstTakr\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"formatterPrecision\": 0\n  },\n  {\n    \"dataField\": \"satscores.avgScrRead\",\n    \"headerText\": \"Avg Scr Read\",\n    \"uniqueIdentifier\": \"satscores.avgScrRead\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"formatterPrecision\": 0\n  },\n  {\n    \"dataField\": \"satscores.avgScrMath\",\n    \"headerText\": \"Avg Scr Math\",\n    \"uniqueIdentifier\": \"satscores.avgScrMath\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"formatterPrecision\": 0\n  },\n  {\n    \"dataField\": \"satscores.avgScrWrite\",\n    \"headerText\": \"Avg Scr Write\",\n    \"uniqueIdentifier\": \"satscores.avgScrWrite\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"formatterPrecision\": 0\n  },\n  {\n    \"dataField\": \"satscores.numGE1500\",\n    \"headerText\": \"Num GE1500\",\n    \"uniqueIdentifier\": \"satscores.numGE1500\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"lockMode\": \"right\",\n    \"width\": 90,\n    \"formatterPrecision\": 0\n  },\n  {\n    \"dataField\": \"satscores.pctGE1500\",\n    \"headerText\": \"Pct GE1500\",\n    \"uniqueIdentifier\": \"satscores.pctGE1500\",\n    \"format\": \"number\",\n    \"textAlign\": \"right\",\n    \"filterOptions\": {\n      \"filterOperation\": \"Between\"\n    },\n    \"lockMode\": \"right\",\n    \"width\": 90,\n    \"formatterPrecision\": 0\n  }\n]"
        }
      ]
    }
  ],
  "predefinedLists": [
    {
      "values": [
        "admin@test.com"
      ],
      "name": "BETA_FEATURE_USERS",
      "versions": {
        "test": [
          "admin@test.com",
          "internal@test.com"
        ]
      }
    },
    {
      "values": [
        "dev",
        "test",
        "prd"
      ],
      "name": "Environments"
    }
  ]
}