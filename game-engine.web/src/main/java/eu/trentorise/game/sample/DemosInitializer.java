/**
 *    Copyright 2015 Fondazione Bruno Kessler - Trento RISE
 *
 *    Licensed under the Apache License, Version 2.0 (the "License");
 *    you may not use this file except in compliance with the License.
 *    You may obtain a copy of the License at
 *
 *        http://www.apache.org/licenses/LICENSE-2.0
 *
 *    Unless required by applicable law or agreed to in writing, software
 *    distributed under the License is distributed on an "AS IS" BASIS,
 *    WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 *    See the License for the specific language governing permissions and
 *    limitations under the License.
 */

package eu.trentorise.game.sample;

import java.util.Arrays;

import javax.annotation.PostConstruct;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Component;

import eu.trentorise.game.model.AuthUser;
import eu.trentorise.game.model.Game;
import eu.trentorise.game.sec.UsersProvider;
import eu.trentorise.game.service.DefaultIdentityLookup;
import eu.trentorise.game.services.GameService;

@Component
public class DemosInitializer {

	private static final Logger logger = LoggerFactory
			.getLogger(DemosInitializer.class);

	@Autowired
	private UsersProvider usersProvider;

	@Autowired
	private DemoGameFactory gameFactory;

	@Autowired
	private GameService gameSrv;

	@Autowired
	private Environment env;

	@PostConstruct
	@SuppressWarnings("unused")
	private void initDemos() {
		Game g = null;
		boolean secProfileActive = Arrays.binarySearch(env.getActiveProfiles(),
				"sec") >= 0;
		if (secProfileActive) {
			logger.info("sec profile active..create sample game for every user");
			for (AuthUser user : usersProvider.getUsers()) {
				g = gameFactory.createGame(null, null, user.getUsername());
				if (g != null) {
					gameSrv.startupTasks(g.getId());
				}
			}
		} else {
			logger.info("no-sec profile active..create sample game for default user");
			// initialize demo-game for default user in no-sec env
			g = gameFactory.createGame(null, null,
					DefaultIdentityLookup.DEFAULT_USER);
			if (g != null) {
				gameSrv.startupTasks(g.getId());
			}
		}
	}

}
