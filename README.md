# DIGIMANCERS

An apocalyptic battle for supremacy in an ancient ritual of pixellated sorcery! 
Two players connect to the game via their devices and must cast spells to attack
and defend. To attack, draw a carat (^) symbol and swipe it up the screen. To
cast a temporary shield, draw a circle (O) and swipe it down the screen. Every
action costs mana which slowly replenishes over time. Time your attacks well to
penetrate your opponent's guard and assert your dominance! Developed and tested
on latest Chrome for host and devices.


# TO BUILD

The easiest way to build and run digimancers is to install `docker` and
`docker-compose`.

https://docs.docker.com/engine/installation/

If you wish to run it manually, ensure you have node 5.x and npm installed.
Enter the `src/client` folder and run `make build` to build the frontend
application. Once this is complete, enter the `src/server` folder and run
`make run` to bring the backend server online.
