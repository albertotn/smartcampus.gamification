package eu.trentorise.game.services;

import org.springframework.stereotype.Service;

import eu.trentorise.game.model.PlayerState;

@Service
public interface PlayerService {

	public PlayerState loadState(String userId, String gameId);

	public boolean saveState(String userId, String gameId, PlayerState state);
}