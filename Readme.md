# React Battleship game

Battleship game made in React + TS + Vite + Vitest.

## How to run

If you want to run it in local, clone this repo, run `yarn install` and once the dependencies are done, run `yarn dev` and open the app in [http://127.0.0.1:5173/](http://127.0.0.1:5173/).

## Live

If you want to try, you can visit [https://react-battleship.dimaslz.dev/](https://react-battleship.dimaslz.dev/).

## Game

Board of 10 x 10 squares with 3 boats. 1 Battleship of 5 squares and, 2 destroyers of 4 squares each one. Each box has letters and numbers to identify columns and rows where, the colums are the letters (A, B, C, D, E, F, J, H, I, J) and the rows are the numbers(1, 2, 3, 4, 5, 6, 7, 8, 9, 10).

![Board screenshot](/screenshots/board-screenshot.png)

To setup the boats in the board, the following screenshot is the setting screen. To put a boat in the board, just click in one of the boats list on the right and after, click in the board in the position as you want. To change the orientation, press `space`.

![Board settings screenshot](/screenshots/setting-board-screenshot.png)

Once you are playing, you will see your ships on the board highlighted with a blue color.

When it is your turn, and you click on any square (E4 in this example), the square is highlighted with a dashed red border and a bold text meaning, that your shot was successful.

Now, if you click on any square (now G5), it will be highlighted with blue dashes and bold text, meaning that the shot was missed, the shot went into the water.

![Board while playing screenshot](/screenshots/board-while-playing-screenshot.png)

When you sunk one of the boats of the computer, you will see all the squares with a dashed dark red border (example: A3, B3, C3, D4).

![Board boat is sunk screenshot](/screenshots/board-boat-is-sunk-screenshot.png)

## TODO

* [ ] Add sprites to replace blue squeares per boat draws.
* [ ] Add animations on touch a boat.
* [ ] Add animations on failure.
* [ ] Allow to play directly with the keyboard.
* [ ] Mobile version.
* [ ] Add socket to play with friends.
* [ ] [Computer logic] Now, the computer throws a random shot at an available square on the board (excluding those already made). The logic could be improved if the shots were around the last hits.
* [ ] Keep game state on reload.
