import { Form, Row, Input, Icon, Button, Checkbox, Col } from 'antd';
import React, { Component } from 'react';
import './BinarySearchOrchestrator.css';
import PerfCompare from '../PerfCompare/PerfCompare'
const FormItem = Form.Item;
var testingTitle;
var oldURL;
var newURL;

export default class BinarySearchOrchestrator extends Component {
	state = {
        copy: { testName: true, badURL: true, goodURL: true },
		inputURL: [{}, {}, {}],
        forms: {
            testName: "", badURL: "", goodURL: ""
        },
		fields: {
			badBuildNum: "", goodBuildNum: ""
		},
        selectedRuns: {
            baselineID: "",
            testID: "",
        },
		submitStatus: 'none',
    }
	handleChange(event) {
		this.state.forms[event.target.name]=event.target.value;
        this.setState(this.state);
    }
	reset = () => {
		/*this.state.forms.testName="";
		this.state.forms.badURL="";
		this.state.forms.goodURL="";*/
		window.location.reload();
	}
	submitRequest = async () => {
		this.setState(
            {
                submitStatus: 'submit',
            }
        )
		alert("Testname: "+this.state.forms.testName +" Bad test: "+ this.state.forms.badURL +" Good test: "+ this.state.forms.goodURL);
		
		
		/*Parse through the URL to get the build number*/
		this.parseURL()
		/*This part here is to wait for the database entries to be searched through*/
		
		const testBuildTestInfo = await fetch( `/api/getTestInfoByBuildInfo?url=${this.state.forms.goodURL}&buildName=${this.state.forms.testName}&buildNum=${this.state.fields.goodBuildNum}`, {
            method: 'get'
        } );
/*
        let baselineTestResultsJson = await baselineBuildTestInfo.json();
        let testTestResultsJson = await testBuildTestInfo.json();
		this.displayTestResult();*/
	}
	
	/*Recursive function to search through database
	searchTests = async (baseLine, test) => {
		if(beside each other){
			return test;
		}
		else{
			if(this.searchDatabase()){
			}
			else{
			}
			return this.searchDatabase(baseLine, test);
		}
	}
	*/
	parseURL = async () => {
		let displayErrorMessage = "";
		let baselineBuildURL, testBuildURL;
            let baselineURLScheme, baselineHostWithPort, baselineBuildName, baselineBuildNum;
            let testURLScheme, testHostWithPort, testBuildName, testBuildNum;
            let baselineBuildURLSplit, testBuildURLSplit;
            if (this.state.forms.goodURL && this.state.forms.badURL) {
                baselineBuildURLSplit = this.state.forms.goodURL.split("/");
                testBuildURLSplit = this.state.forms.badURL.split("/");
            }
            
            // Find the index for the top level "job" path in the Jenkins URLs given.
            // This is to support comparing the following equivalent Jenkins job URLs:
            // https://customJenkinsServer/view/PerfTests/job/Daily-Liberty-DayTrader3/155/
            // https://customJenkinsServer/job/Daily-Liberty-DayTrader3/155/

            let jenkinsTopLevelJobIndexBaseline, jenkinsTopLevelJobIndexTest;
            if (baselineBuildURLSplit && testBuildURLSplit){
                jenkinsTopLevelJobIndexBaseline= baselineBuildURLSplit.indexOf("job");
                jenkinsTopLevelJobIndexTest= testBuildURLSplit.indexOf("job");
            }

            try {
                baselineURLScheme = baselineBuildURLSplit[0];
                baselineHostWithPort = baselineBuildURLSplit[2];
                baselineBuildName = baselineBuildURLSplit[jenkinsTopLevelJobIndexBaseline + 1];
                baselineBuildNum = baselineBuildURLSplit[jenkinsTopLevelJobIndexBaseline + 2];

                // Build the original URL composed of host and port only
                baselineBuildURL = baselineURLScheme + "//" + baselineHostWithPort;

                // Check if the benchmark and test data is valid
                if (baselineBuildNum === undefined || (baselineBuildURL === undefined )) {
                    displayErrorMessage += "Invalid Baseline URL. "
                }
            } catch (baselineBuildURLSplitError) {
                displayErrorMessage += "Invalid Baseline URL. "
            }

            try {
                testURLScheme = testBuildURLSplit[0];
                testHostWithPort = testBuildURLSplit[2];
                testBuildName = testBuildURLSplit[jenkinsTopLevelJobIndexTest + 1];
                testBuildNum = testBuildURLSplit[jenkinsTopLevelJobIndexTest + 2];

                testBuildURL = testURLScheme + "//" + testHostWithPort;

                if (testBuildNum === undefined || (testBuildURL === undefined )) {
                    displayErrorMessage += "Invalid Test URL. "
                }
            } catch (testBuildURLSplit) {
                displayErrorMessage += "Invalid Test URL. "
            }

            // Data received is not valid
            alert(displayErrorMessage);

            await this.setState(
                {
                    fields: {
                        badBuildNum: baselineBuildNum,
                        goodBuildNum: testBuildNum,
                    }
                }
            )

	}
	/*
	searchDatabase = async (test) => {
		const baselineBuildTestInfo = await fetch( `/api/getTestInfoByBuildInfo?url=${this.state.forms.badURL}&buildName=${this.state.forms.testName}&buildNum=${this.state.fields.badBuildNum}`, {
            method: 'get'
        } );
            method: 'get'
        } );
		if (entry exists)
			return true;
		else
			return false;
	}*/
	
	displayTestResult = async () => {
		this.setState(
            {
                submitStatus: 'done',
            }
        )
		/*Show results of binary search*/
	}

    render() {
		/*<Form className="ant-advanced-search-form" onSubmit={this.onSubmitClick}>*/
		/*<Button type="primary" htmlType="submit">Search</Button>*/
		/*<PerfCompare />*/
		if (this.state.submitStatus === "done") {
		}
		else if (this.state.submitStatus === "submit") {
			return (
                    <div>
                        <Row type="flex" justify="space-around" align="middle">
                            <h1>Generating Performance Comparison</h1>
							
                        </Row>
                    </div>
                )
		}
		else{
			return(
				<div>
				 <Form>
					<Row gutter={24}>
					<Col span={23}>
						<FormItem label="Name of build" style={{fontSize:20, fontWeight:'bold'}}>
							<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} name = "testName" id ="testName" placeholder="Test Name" allowClear onChange={this.handleChange.bind( this )}/>
						</FormItem>
						</Col>
						<Col span={10}>
							<FormItem label="First seen bad build" style={{fontSize:20, fontWeight:'bold'}}>
								<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} name = "badURL" placeholder="Bad Test URL" allowClear onChange={this.handleChange.bind( this )}/>
							</FormItem>
						</Col>
						<Col span={3}></Col>
						<Col span={10}>
							<FormItem label="Last seen good build" style={{fontSize:20, fontWeight:'bold'}}>
								<Input prefix={<Icon type="user" style={{ fontSize: 13 }} />} name = "goodURL" placeholder="Good Test URL" allowClear onChange={this.handleChange.bind( this )}/>
							</FormItem>
						</Col>
					</Row>
					<Row>
						<Col span={24} style={{ textAlign: 'left' }}>
							<Button type="primary" onClick={this.submitRequest}>Search</Button>
							<Button style={{ marginLeft: 8 }} onClick={this.reset}>Clear</Button>
						</Col>
					</Row>
					</Form>
				</div>
			)
		}
    }
}