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
	CallbackState,
	DelayState,
	EndDataCondition,
	ForEachState,
	InjectState, OnErrors,
	OperationState,
	ParallelState,
	Schedule,
	SubFlowState,
	SwitchState,
	Transition,
} from "./workflow";

export type Arguments = object;

export type FunctionName = string;
export type FunctionRef = | FunctionName
	| {
	/**
	 * Name of the referenced function
	 */
	refName: FunctionName;
	/**
	 * Function arguments
	 */
	arguments?: Arguments;
};

export  type EventRef = {
	/**
	 * Reference to the unique name of a 'produced' event definition
	 */
	triggerEventRef?: string;
	/**
	 * Reference to the unique name of a 'consumed' event definition
	 */
	resultEventRef?: string;
	/**
	 * If string type, an expression which selects parts of the states data output to become the data (payload) of the event referenced by 'triggerEventRef'. If object type, a custom object to become the data (payload) of the event referenced by 'triggerEventRef'.
	 */
	data?: EventData;
	/**
	 * Add additional extension context attributes to the produced event
	 */
	contextAttributes?: ContextAttributes;
};

export type ActionDataFilter = {
	/**
	 * Workflow expression that selects state data that the state action can use
	 */
	fromStateData?: string;
	/**
	 * Workflow expression that filters the actions data results
	 */
	results?: string;
	/**
	 * Workflow expression that selects a state data element to which the action results should be added/merged into. If not specified, denote, the top-level state data element
	 */
	toStateData?: string;
};
export type Action = {
	/**
	 * Unique action definition name
	 */
	name?: string;
	
	/**
	 * Referenced function
	 */
	functionRef?: FunctionRef;
	/**
	 * References a 'trigger' and 'result' reusable event definitions
	 */
	eventRef?: EventRef;
	/**
	 * Time period to wait for function execution to complete
	 */
	timeout?: string;
	/**
	 * Action data filter
	 */
	actionDataFilter?: ActionDataFilter;
};
export type Actions = Action[];


export type FunctionType = "rest" | "rpc" | "expression";
export type FunctionDef = {
	/**
	 * Unique function name
	 */
	name: string;
	/**
	 * If type is `rest`, <path_to_openapi_definition>#<operation_id>. If type is `rpc`, <path_to_grpc_proto_file>#<service_name>#<service_method>. If type is `expression`, defines the workflow expression.
	 */
	operation: string;
	/**
	 * Defines the function type. Is either `rest`, `rpc` or `expression`. Default is `rest`
	 */
	type?: FunctionType;
};

export type URIDefinition = string;
export type FunctionList = [
	FunctionDef,
	...FunctionDef[]
];
export type Functions = | URIDefinition
	| FunctionList;
export type States = [
	(
		| DelayState
		| EventState
		| OperationState
		| ParallelState
		| SwitchState
		| SubFlowState
		| InjectState
		| ForEachState
		| CallbackState
		),
	...(
		| DelayState
		| EventState
		| OperationState
		| ParallelState
		| SwitchState
		| SubFlowState
		| InjectState
		| ForEachState
		| CallbackState
		)[]
];

export type StateDataFilter = {
	/**
	 * Workflow expression to filter the state data input
	 */
	input?: string;
	/**
	 * Workflow expression that filters the state data output
	 */
	output?: string;
};

export type Terminate = boolean;
export type End = | Terminate
	| {
	/**
	 * If true, completes all execution flows in the given workflow instance
	 */
	terminate?: Terminate;
	/**
	 * Defines events that should be produced
	 */
	produceEvents?: ProduceEventsDef;
	/**
	 * If set to true, triggers workflow compensation. Default is false
	 */
	compensate?: boolean;
};

export type DataConditions = (TransitionDataCondition | EndDataCondition)[];

export type ActionModeType = "sequential" | "parallel";
export type DefaultTransition = {
	transition: Transition;
	end: End;
};

export type StateName = string;
export type StartScheduled = {
	/**
	 * Name of the starting workflow state
	 */
	stateName: StateName;
	/**
	 * Define the time/repeating intervals or cron at which workflow instances should be automatically started.
	 */
	schedule: Schedule;
};

export type Metadata = {
	[k: string]: string;
};

export type EventKind = "consumed" | "produced";
export type EventDef = {
	/**
	 * Unique event name
	 */
	name?: EventName;
	/**
	 * CloudEvent source
	 */
	source?: string;
	/**
	 * CloudEvent type
	 */
	type?: string;
	/**
	 * Defines the CloudEvent as either 'consumed' or 'produced' by the workflow. Default is 'consumed'
	 */
	kind?: EventKind;
	/**
	 * CloudEvent correlation definitions
	 */
	correlation?: [
		{
			/**
			 * CloudEvent Extension Context Attribute name
			 */
			contextAttributeName: string;
			/**
			 * CloudEvent Extension Context Attribute value
			 */
			contextAttributeValue?: string;
		},
		...{
			/**
			 * CloudEvent Extension Context Attribute name
			 */
			contextAttributeName: string;
			/**
			 * CloudEvent Extension Context Attribute value
			 */
			contextAttributeValue?: string;
		}[]
	];
	/**
	 * Metadata information
	 */
	metadata?: Metadata;
};
export type EventList = [
	EventDef,
	...EventDef[]
];
export type Events = | URIDefinition
	| EventList;

type RetryType = {
	/**
	 * Unique retry strategy name
	 */
	name: string;
	/**
	 * Time delay between retry attempts (ISO 8601 duration format)
	 */
	delay?: string;
	/**
	 * Maximum time delay between retry attempts (ISO 8601 duration format)
	 */
	maxDelay?: string;
	/**
	 * Static value by which the delay increases during each attempt (ISO 8601 time format)
	 */
	increment?: string;
	/**
	 * Numeric value, if specified the delay between retries is multiplied by this value.
	 */
	multiplier?: number | string;
	/**
	 * Maximum number of retry attempts.
	 */
	maxAttempts: number | string;
	/**
	 * If float type, maximum amount of random time added or subtracted from the delay between each retry relative to total delay (between 0 and 1). If string type, absolute maximum amount of random time added or subtracted from the delay between each retry (ISO 8601 duration format)
	 */
	jitter?: number | string;
};
export type RetriesDef = | string
	| [
	RetryType,
	...RetryType[]
];


export type EventName = string;

export type EventsName = [EventName, ...EventName[]];

export type Repeat = {
	/**
	 * Expression evaluated against SubFlow state data. SubFlow will repeat execution as long as this expression is true or until the max property count is reached
	 */
	expression?: string;
	/**
	 * If true, the expression is evaluated before each repeat execution, if false the expression is evaluated after each repeat execution
	 */
	checkBefore?: boolean;
	/**
	 * Sets the maximum amount of repeat executions
	 */
	max?: number;
	/**
	 * If true, repeats executions in a case unhandled errors propagate from the sub-workflow to this state
	 */
	continueOnError?: boolean;
	/**
	 * List referencing defined consumed workflow events. SubFlow will repeat execution until one of the defined events is consumed, or until the max property count is reached
	 */
	stopOnEvents?: EventsName;
};

export type CronExpression = string;
export type CronDef =
	|
	/**
	 * Cron expression defining when workflow instances should be created (automatically)
	 */
	CronExpression
	| {
	/**
	 * Repeating interval (cron expression) describing when the workflow instance should be created
	 */
	expression: CronExpression;
	/**
	 * Specific date and time (ISO 8601 format) when the cron expression invocation is no longer valid
	 */
	validUntil?: string;
};

export type OnEvent = {
	/**
	 * References one or more unique event names in the defined workflow events
	 */
	eventRefs: EventsName;
	/**
	 * Specifies how actions are to be performed (in sequence of parallel)
	 */
	actionMode?: "sequential" | "parallel";
	/**
	 * Actions to be performed if expression matches
	 */
	actions?: Actions;
	/**
	 * Event data filter
	 */
	eventDataFilter?: {
		/**
		 * Workflow expression that filters of the event data (payload)
		 */
		data?: string;
		/**
		 *  Workflow expression that selects a state data element to which the event payload should be added/merged into. If not specified, denotes, the top-level state data element.
		 */
		toStateData?: string;
	};
};

export type OnEvents = OnEvent[];

export interface EventState {
	/**
	 * Unique State id
	 */
	id?: string;
	/**
	 * State name
	 */
	name: string;
	/**
	 * State type
	 */
	type: "event";
	/**
	 * If true consuming one of the defined events causes its associated actions to be performed. If false all of the defined events must be consumed in order for actions to be performed
	 */
	exclusive?: boolean;
	onEvents: OnEvents;
	/**
	 * Time period to wait for incoming events (ISO 8601 format)
	 */
	timeout?: string;
	/**
	 * State data filter
	 */
	stateDataFilter?: StateDataFilter;
	/**
	 * States error handling and retries definitions
	 */
	onErrors?: OnErrors;
	/**
	 * Next transition of the workflow after all the actions have been performed
	 */
	transition:Transition;
	/**
	 * State end definition
	 */
	end:End;
	/**
	 * Unique Name of a workflow state which is responsible for compensation of this state
	 */
	compensatedBy?: string;
	/**
	 * Metadata information
	 */
	metadata?: Metadata;
}

export type Interval = string;

export type ExpressionExtractData = string;

export type DataObject = object;

export type EventData =
	| ExpressionExtractData
	| DataObject;

export type ContextAttributes = object;

export type ProduceEventDef = {
	/**
	 * References a name of a defined event
	 */
	eventRef: EventName;
	/**
	 * If String, expression which selects parts of the states data output to become the data of the produced event. If object a custom object to become the data of produced event.
	 */
	data?: EventData;
	/**
	 * Add additional event extension context attributes
	 */
	contextAttributes?: ContextAttributes;
};
export type ProduceEventsDef = ProduceEventDef[];

/**
 * Switch state data based condition
 */
export interface TransitionDataCondition {
	/**
	 * Data condition name
	 */
	name?: string;
	/**
	 * Workflow expression evaluated against state data. Must evaluate to true or false
	 */
	condition: string;
	/**
	 * Workflow transition if condition is evaluated to true
	 */
	transition: Transition;
	/**
	 * Metadata information
	 */
	metadata?: Metadata;
}



export type Branch =
	{
		/**
		 * Branch name
		 */
		name: string;
		/**
		 * Actions to be executed in this branch
		 */
		actions?: Action[];
		/**
		 * Unique Id of a workflow to be executed in this branch
		 */
		workflowId: string;
	} | {
	/**
	 * Branch name
	 */
	name: string;
	/**
	 * Actions to be executed in this branch
	 */
	actions: Action[];
	/**
	 * Unique Id of a workflow to be executed in this branch
	 */
	workflowId?: string;
};
export type Branches = Branch[];

export type CompletionType = "and" | "xor" | "n_of_m";
