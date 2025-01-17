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
import {
	EventBuilder,
	EventsBuilder,
	EventStateBuilder,
	OnEventBuilder,
	RepeatBuilder,
	SubFlowStateBuilder,
	WorkflowBuilder,
} from "../../src";
import * as fs from "fs";


describe("checkcarvitals workflow example", () => {
	
	
	it('should generate Workflow object', function () {
		
		const workflow = new WorkflowBuilder()
			.withId("checkcarvitals")
			.withVersion("1.0")
			.withName("Check Car Vitals Workflow")
			.withStart("WhenCarIsOn")
			.withStates([
				new EventStateBuilder()
					.withName("WhenCarIsOn")
					.withOnEvents([
						new OnEventBuilder()
							.withEventsRef(["CarTurnedOnEvent"])
							.build(),
					])
					.withTransition("DoCarVitalsChecks")
					.build(),
				new SubFlowStateBuilder()
					.withName("DoCarVitalsChecks")
					.withWorkflowId("vitalscheck")
					.withRepeat(new RepeatBuilder()
						.withStopOnEvents(["CarTurnedOffEvent"])
						.build())
					.withEnd(true)
					.build(),
			])
			.withEvents(
				new EventsBuilder()
					.withEvents([
						new EventBuilder()
							.withName("CarTurnedOnEvent")
							.withType("car.events")
							.withSource("my/car/start")
							.build(),
						new EventBuilder()
							.withName("CarTurnedOffEvent")
							.withType("car.events")
							.withSource("my/car/start")
							.build(),
					
					]).build(),
			)
			.build();
		
		
		const expected = JSON.parse(fs.readFileSync("./spec/examples/checkcarvitals.json")
			.toLocaleString()) as any;
		expect(workflow).toEqual(expected);
		
	});
	
	
});
