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
import {EventDef, EventKind, EventName} from './types';

export class EventBuilder {
	private model: EventDef = {
		kind: "consumed"
	};
	
	withName(value: EventName): EventBuilder {
		this.model.name = value;
		return this;
	}
	
	withType(value: string): EventBuilder {
		this.model.type = value;
		return this;
	}
	
	withSource(value: string): EventBuilder {
		this.model.source = value;
		return this;
	}
	
	
	withKind(value: EventKind): any {
		this.model.kind = value;
		return this;
	}

	build(): EventDef {
		//TODO validate
		return this.model;
	}
	
	
}
