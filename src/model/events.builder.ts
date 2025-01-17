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
import {EventList, Events, URIDefinition} from '../index';

export class EventsBuilder {
	
	private events: EventList;
	private URIDefinition: URIDefinition;
	
	
	withURIDefinition(value: URIDefinition): EventsBuilder {
		this.URIDefinition = value;
		return this;
	}
	
	withEvents(value: EventList): EventsBuilder {
		this.events = value;
		return this;
	}
	
	build(): Events {
		
		
		//TODO validate
		if (this.URIDefinition) {
			return this.URIDefinition;
		}
		
		return this.events;
	}
	
	
}
