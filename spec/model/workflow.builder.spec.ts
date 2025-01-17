/*
 * Copyright 2021-Present The Serverless Workflow Specification Authors
 * <p>
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * <p>
 * http://www.apache.org/licenses/LICENSE-2.0
 * <p>
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import {InjectStateBuilder, Workflow, WorkflowBuilder} from "../../src";
import {ValidationError, ValidationErrors, ValidatorFactory, WorkflowValidator} from "../../src/model/workflow.validator";


describe("workflow builder", () => {
	
	
	it("should create a workflow with mandatory fields", () => {
		const workflow: Workflow = new WorkflowBuilder()
			.withId("helloworld")
			.withName("hello world")
			.withVersion("0.6")
			.withStart("hello builder")
			.withStates([new InjectStateBuilder()
				.withName("Hello State")
				.withData({
					"result": "Hello World!",
				})
				.withEnd(true).build()])
			.build();
		
		expect(workflow).toEqual({
				"id": "helloworld",
				"name": "hello world",
				"version": "0.6",
				"start": "hello builder",
				"states": [{
					"type": "inject", "name": "Hello State",
					"data": {"result": "Hello World!"},
					"end": true,
				}],
			},
		);
		
	});
	
	
	it("should create a workflow with all fields", () => {
		const workflow: Workflow =
			new WorkflowBuilder()
				.withId("helloworld")
				.withName("hello world")
				.withVersion("0.6")
				.withStart("hello builder")
				.withStates([new InjectStateBuilder()
					.withName("Hello State")
					.withData({
						"result": "Hello World!",
					})
					.withEnd(true).build()])
				.withDescription("hello builder description")
				.withSchemaVersion("0.6")
				.withSchemaVersion("1.0")
				.withExpressionLang("jq")
				.withExecTimeout({duration: 'PT2M'})
				.withKeepActive(true)
				.withMetadata({
					"key1": "value1",
					"key2": "value2",
				})
				.withEvents("http://myhost:8080/eventsdefs.json")
				.withFunctions("http://myhost:8080/functionsdefs.json")
				.withRetries("http://myhost:8080/retriesdefs.json")
				.build();
		
		expect(workflow).toEqual({
				"id": "helloworld",
				"name": "hello world",
				"version": "0.6",
				"start": "hello builder",
				"states": [{
					"type": "inject", "name": "Hello State",
					"data": {"result": "Hello World!"},
					"end": true,
				}],
				"description": "hello builder description",
				"schemaVersion": "1.0",
				"expressionLang": "jq",
				"execTimeout": {duration: 'PT2M'},
				"keepActive": true,
				"metadata": {
					"key1": "value1",
					"key2": "value2",
				},
				"events": "http://myhost:8080/eventsdefs.json",
				"functions": "http://myhost:8080/functionsdefs.json",
				"retries": "http://myhost:8080/retriesdefs.json",
			},
		);
		
	});
	
	
	it("should invoke validator class", () => {
		
		const workflowValidator = new WorkflowValidator({});
		spyOn(workflowValidator, 'isValid')
			.and.returnValue(false);
		spyOn(workflowValidator, 'validate')
			.and.returnValue(new ValidationErrors([new ValidationError("any error")]));
		
		const validatorFactory = new ValidatorFactory();
		spyOn(validatorFactory, 'workflowValidator')
			.and.returnValue(workflowValidator);
		
		try {
			new WorkflowBuilder(validatorFactory)
				.build();
		} catch (error) {
			//Expected method build to throw an error
		}
		
		
		expect(workflowValidator.isValid).toHaveBeenCalled();
		expect(workflowValidator.validate).toHaveBeenCalled();
		
		
	});
	
	
	it("should thrown an error if any mandatory field is not set", () => {
		expect(() => {
			new WorkflowBuilder().build();
		}).toThrowError();
	});
	
	
});
