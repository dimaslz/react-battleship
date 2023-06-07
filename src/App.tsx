import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

import './App.css'
import { randomNumber } from './utils';
import { BOARD_ITEM, TORIENTATION } from './types';
import { BOARD_SIZE, BOATS, ORIENTATION, PLAYER, SHOT_VALUE } from './constants';
import { createBoard, generateItems } from './methods';
import WelcomeLayout from './components/welcome-layout.component';

type BOAT_STATUS = {
  uuid?: string;
  name: string;
  damage: {
    box: string;
    col: number;
    row: number;
  }[];
}

type TPLAYER_DATA = {
  name: string;
  boats: { [key: string]: BOAT_STATUS };
}

let boatsForPlayer = structuredClone(BOATS.map(b => ({
  ...b,
  pending: false,
  done: false,
})));

function App() {
  const [computerData, setComputerData] = useState<TPLAYER_DATA>();
  const [playerData, setPlayerData] = useState<TPLAYER_DATA>();
  const [boxesOver, setBoxesOver] = useState<number[]>([]);
  const [showComputerBoats, setShowComputerBoats] = useState<boolean>(false);
  const [gameStarted, setGameStarted] = useState<boolean>(false);
  const [gameReady, setGameReady] = useState<boolean>(false);
  const [gameCounter, setGameCounter] = useState<number>(5);
  const [counterState, setCounterState] = useState<string>("");
  const [hideBoats, setHideBoats] = useState<boolean>(false);

  const [boatToSet, setBoatToSet] = useState<any | null>(null);
  const [cursorPosition, setCursorPosition] = useState<any | null>(null);
  const [items, setItems] = useState<any[]>(structuredClone(generateItems()));

  const playersAreReady = useMemo(() => {
    const boatsLeng = BOATS.map((boat) => boat.squares)
      .reduce((accumulator, current) => accumulator + current, 0);
    const computerIsReady = items.filter((item) => item.player[PLAYER.COMPUTER]?.filled).length === boatsLeng;
    const humanIsReady = items.filter((item) => item.player[PLAYER.HUMAN]?.filled).length === boatsLeng;

    return computerIsReady && humanIsReady;
  }, [items])

  const isConflict = useMemo(() => {
    return boatToSet && items.some((i: any) => {
      return i.player[PLAYER.HUMAN].filled && boxesOver.includes(i.box);
    });
  }, [boxesOver, items, boatToSet]);
  const orientation = useRef<TORIENTATION>(ORIENTATION.HORIZONTAL);

  const setBoatPosition = useCallback(({ box, row, boat }: any) => {
    const horizontal = orientation.current === ORIENTATION.HORIZONTAL;
    const vertical = orientation.current === ORIENTATION.VERTICAL;

    let boxes = [box]
    const even = Boolean(boat % 2);
    const rest = Math.ceil(boat / 2);

    if (horizontal) {
      const boxLeft = even ? rest - 1 : rest;
      const boxRight = even ? rest - 1 : rest - 1;

      boxes = [
        ...Array.from(new Array(boxLeft)).map((_, k) => box - (k + 1)).reverse(),
        ...boxes,
        ...Array.from(new Array(boxRight)).map((_, k) => box + (k + 1))
      ];

      const outLeft = Math.max(0, (BOARD_SIZE * (row - 1)) - (boxes[0] + 1) + boxLeft);
      const outRight = Math.max(0, ((boxes[boxes.length - 1]) - (BOARD_SIZE * row)));

      if (outLeft > 0) {
        boxes = [
          ...Array.from(new Array(boxLeft - outLeft)).map((_, k) => box - (k + 1)).reverse(),
          box,
          ...Array.from(new Array(outLeft + boxRight)).map((_, k) => box + (k + 1))
        ];
      }
      if (outRight > 0) {
        boxes = [
          ...Array.from(new Array(outRight + boxLeft)).map((_, k) => box - (k + 1)).reverse(),
          box,
          ...Array.from(new Array(boxRight - outRight)).map((_, k) => box + (k + 1)),
        ];
      }
    }

    if (vertical) {
      const boxTop = even ? rest - 1 : rest;
      const boxBottom = even ? rest - 1 : rest - 1;

      boxes = [
        ...Array.from(new Array(boxTop)).map((_, k) => {
          return box - ((k + 1) * BOARD_SIZE)
        }).reverse(),
        ...boxes,
        ...Array.from(new Array(boxBottom)).map((_, k) => {
          return box + ((k + 1) * BOARD_SIZE)
        })
      ];

      const outTop = boxes.filter(i => i <= 0).length;
      const outBottom = boxes.filter(i => i > 100).length;

      if (outTop > 0) {
        boxes = [
          ...Array.from(new Array(boxTop - outTop)).map((_, k) => {
            return box - ((k + 1) * BOARD_SIZE)
          }),
          box,
          ...Array.from(new Array(outTop + boxBottom)).map((_, k) => {
            return box + ((k + 1) * BOARD_SIZE)
          })
        ];
      } else if (outBottom > 0) {
        boxes = [
          ...Array.from(new Array(boxTop + outBottom)).map((_, k) => {
            return box - ((k + 1) * BOARD_SIZE)
          }).reverse(),
          box,
          ...Array.from(new Array(boxBottom - outBottom)).map((_, k) => {
            return box + ((k + 1) * BOARD_SIZE)
          })
        ];
      }
    }

    setBoxesOver(boxes);
    setItems((prevItems) => {
      return (prevItems.map((i, k) => {
        if (boxes.includes(i.box)) {
          i.over = true
        } else {
          i.over = false
        }

        return i
      }))
    });

    return boxes;
  }, [orientation])

  const switchOrientation = () => {
    orientation.current = orientation.current === ORIENTATION.HORIZONTAL
      ? ORIENTATION.VERTICAL
      : ORIENTATION.HORIZONTAL;
  }

  const onKeydownHandler = useCallback(async ($event: any) => {
    if ($event.code === "Space") {
      switchOrientation();

      if (cursorPosition) {
        setBoatPosition(cursorPosition);
      }
    }
  }, [cursorPosition, setBoatPosition]);

  useEffect(() => {
    document.addEventListener("keydown", onKeydownHandler);

    return () => {
      document.removeEventListener("keydown", onKeydownHandler);
    }
  }, [onKeydownHandler])

  // INIT
  let mounted = false;
  useEffect(() => {
    if (!gameStarted) return;
    if (mounted) return;
    setItems(structuredClone(generateItems()));

    mounted = true;

    const boats: any[] = [...BOATS];
    let _items = structuredClone(items);

    while (boats.length) {
      const boat = (boats.pop());
      const box = randomNumber(1, BOARD_SIZE * BOARD_SIZE);
      const row = Math.ceil(box / BOARD_SIZE);
      orientation.current = [ORIENTATION.VERTICAL, ORIENTATION.HORIZONTAL][randomNumber(0, 1)];

      const boxes = setBoatPosition({ box, row, boat: boat?.squares });

      const conflict = _items.some((i: any) => {
        return i.player[PLAYER.COMPUTER].filled && boxes.includes(i.box);
      });

      if (conflict) {
        boats.push(boat);

        continue;
      }

      _items = _items.map((i: any) => {
        if (boxes.includes(i.box)) {
          return {
            ...i,
            player: {
              ...i.player,
              [PLAYER.COMPUTER]: {
                ...i.player[PLAYER.COMPUTER],
                filled: true,
              }
            },
          };
        }

        return i;
      })
    }

    setItems(_items)
  }, [gameStarted])

  const board = useMemo(() => {
    return createBoard(items);
  }, [items])

  const update = () => {
    setItems((prevItems) => {
      prevItems[35].done = true;

      return structuredClone(prevItems);
    })
  }

  const onMouseOverToSetBoatHandler = useCallback(({ box, row }: any) => {
    if (!boatToSet) return;

    setCursorPosition({ box, row, boat: boatToSet.boat.squares });
    setBoatPosition({ box, row, boat: boatToSet.boat.squares });
  }, [setCursorPosition, setBoatPosition, boatToSet]);

  const playerBoatsDone = useMemo(() => {
    const squares = BOATS.map(b => b.squares).reduce((a, b) => a + b, 0);
    return items.filter(i => i.player[PLAYER.HUMAN].filled).length === squares;
  }, [items]);

  const onClickToSetBoatHandler = useCallback(() => {
    if (playerBoatsDone) return;
    if (!boatToSet) return;

    setItems((prevItems: any) => {
      return prevItems.map((i: any) => {
        if (boxesOver.includes(i.box)) {
          return {
            ...i,
            player: {
              ...i.player,
              [PLAYER.HUMAN]: {
                ...i.player[PLAYER.HUMAN],
                filled: true,
              }
            },
          };
        }

        return i;
      })
    });

    setCursorPosition(null);
    boatsForPlayer[boatToSet.key].pending = false;
    boatsForPlayer[boatToSet.key].done = true;
    setBoatToSet(null);
    setBoxesOver([]);
    setItems((prevItems) => {
      return (prevItems.map((i, k) => {
        i.over = false;

        return i
      }))
    });
  }, [boxesOver, boatToSet, playerBoatsDone]);

  const onClickBoatHandler = useCallback((boat: any, key: number) => {
    setBoatToSet({ boat, key });

    boatsForPlayer = boatsForPlayer.map((b: any) => ({
      ...b,
      pending: false,
    }))
    boatsForPlayer[key].pending = true;
  }, []);

  const onClickShowComputerBoatsHandler = useCallback(() => {
    setShowComputerBoats((prev: boolean) => !prev);
  }, [])

  const onMouseLeaveBoardHandler = useCallback(() => {
    setItems((prevItems) => {
      return (prevItems.map((i) => {
        i.over = false;

        return i
      }))
    });
  }, [])

  const onStartGame = () => {
    setGameStarted(true);
  }

  const onClickStartGame = useCallback(() => {
    if (playersAreReady) {
      setGameReady(true);
    }
  }, [playersAreReady])

  const onClickBoxToShotHandler = useCallback(({ box }: any) => {
    setItems((prevItems: BOARD_ITEM[]) => {
      return prevItems.map((item: BOARD_ITEM) => {
        const isComputerBoat = item.player[PLAYER.COMPUTER].filled;
        if (item.box === box) {
          item.player[PLAYER.HUMAN].shot = isComputerBoat
            ? SHOT_VALUE.TOUCH
            : SHOT_VALUE.WATER;
        }

        return item;
      })
    });
  }, [])

  const runCounter = useCallback(async () => {
    setCounterState(String(gameCounter));
    await new Promise((resolve) => setTimeout(() => resolve(null), 1000));

    if (gameCounter === 1) {
      setGameCounter(0);
      setCounterState("goooo!");

      await new Promise((resolve) => setTimeout(() => resolve(null), 500));
      setCounterState("");

      return;
    }

    // await new Promise((resolve) => setTimeout(() => resolve(null), 1000));
    if (gameReady) {
      setGameCounter(gameCounter - 1);
    }
  }, [gameReady, gameCounter]);

  useEffect(() => {
    if (!gameReady || gameCounter === 0) return;

    runCounter();
  }, [gameReady, runCounter, gameCounter])

  if (!gameStarted) {
    return <>
      <div className='absolute z-10 inset-0 w-full h-full bg-white'>
        <WelcomeLayout onClickStart={onStartGame} />
      </div>
    </>
  }

  return (
    <>
      <pre>{JSON.stringify(isConflict)}</pre>
      <pre>{JSON.stringify(boxesOver)}</pre>
      <pre>{JSON.stringify(gameReady)}</pre>
      <button onClick={update}>HIT</button>

      <div>
        <div className='flex'>
          <div className='flex flex-col'>
            <h2>Your board</h2>
            <div className='relative'>
              {counterState && <div className='absolute inset-0 w-full h-full bg-white bg-opacity-80 flex items-center justify-center'>
                {counterState && <div className='text-8xl'>{counterState}</div>}
              </div>}
              <div className='flex flex-col w-full justify-center items-center' onMouseLeave={onMouseLeaveBoardHandler}>
                {board.map((r, rowKey) => {
                  return <div key={rowKey} className='flex'>
                    {r.map((c: any) => <div
                      className='flex'
                      key={c.label}
                      data-position={
                        `{ "col": ${c.col}, "row": ${c.row}, "box": ${c.box} }`
                      }
                      onMouseOver={() => onMouseOverToSetBoatHandler(c)}
                      onClick={() => gameReady
                        ? onClickBoxToShotHandler({ box: c.box })
                        : onClickToSetBoatHandler()
                      }
                    >
                      <div
                        className={[
                          "w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed hover:border-2 hover:cursor-pointer hover:border-slate-600 flex-col",
                          c.player[PLAYER.HUMAN].shot === SHOT_VALUE.TOUCH ? 'border-red-400 border-2' : '',
                          c.player[PLAYER.HUMAN].shot === SHOT_VALUE.WATER ? 'border-blue-400 border-2' : '',
                          c.over && !isConflict && boatToSet ? 'bg-slate-200' : '',
                          c.over && isConflict && boatToSet ? 'bg-red-200 relative' : '',
                          !hideBoats && c.player[PLAYER.HUMAN].filled ? 'bg-blue-500' : '',
                          hideBoats && c.player[PLAYER.HUMAN].filled ? 'bg-blue-50' : '',
                        ].join(' ')}
                      ><div>{c.label}</div><div className='text-xs'>{c.box}</div></div>
                    </div>)}
                  </div>
                })}
              </div>
              {gameReady && !counterState && <div className='w-full flex items-start'>
                <button
                  onClick={() => setHideBoats((prev) => !prev)}
                  className='p-2 bg-blue-800 text-white hover:bg-blue-950'
                >
                  {!hideBoats && <span>hide boats</span>}
                  {hideBoats && <span>show boats</span>}
                </button>
              </div>}
            </div>
          </div>

          {!gameReady && <div className='w-full bg-slate-50 p-4'>
            <h2>Boats</h2>
            <div className='text-sm py-4'>
              <p>Here your boats! Click on one of them and (the color will turn to orange), and move the mouse to on the Board in the left. Press <code className='font-console'>space</code> bar to change the orientation. Once you have desired where you want to sert your boat, click on the box in the board and back here to get other boat.</p>
            </div>
            <div className='w-auto space-y-4'>
              {boatsForPlayer?.map((boat: any, boatKey: number) =>
                <div className='relative' key={boatKey} onClick={() => onClickBoatHandler(boat, boatKey)}>
                  <div className='w-full h-full absolute flex items-center justify-center pointer-events-none'>{boat.label}</div>
                  <div className='flex items-center justify-center pointer-events-none'>
                    {Array.from(new Array(boat.squares)).map((_, squareKey: number) => {
                      return <div className={[
                        'w-[50px] h-[50px] border',
                        boat.pending ? 'bg-orange-200' : 'bg-blue-600',
                        boat.done ? 'bg-green-200' : 'bg-blue-600',
                      ].join(" ")} key={squareKey}></div>
                    })}
                  </div>
                </div>)}
            </div>

            <div className='mt-12'>
              <button
                className={[
                  "text-2xl py-2 px-6 bg-blue-600 text-white rounded-lg hover:bg-blue-800 hover:cursor-pointer",
                  !playerBoatsDone ? "cursor-not-allowed disabled:bg-gray-400" : ''
                ].join(" ")}
                disabled={!playersAreReady}
                onClick={onClickStartGame}
              >start</button>
            </div>
          </div>}
          {gameReady && <div className='w-full p-4'>
            <h2>Scores</h2>

            <div className='w-auto space-y-4'>
              ...
            </div>
          </div>}
        </div>

        <div className='flex w-full justify-start mt-12'>
          <button
            onClick={onClickShowComputerBoatsHandler}
            className='p-2 bg-blue-800 text-white'
          >
            {!showComputerBoats && <span>show computer boats (just to test)</span>}
            {showComputerBoats && <span>hide computer boats</span>}
          </button>
        </div>
        {showComputerBoats && <div>
          <h2>Computer board</h2>
          <div className='flex flex-col w-full justify-center items-center'>
            {board.map((r, rowKey) => {
              return <div key={rowKey} className='flex'>
                {r.map((c: any) => <div
                  className='flex'
                  key={c.label}
                  data-position={
                    `{ "col": ${c.col}, "row": ${c.row}, "box": ${c.box} }`
                  }
                  onMouseOver={() => onMouseOverToSetBoatHandler(c)}
                  onClick={onClickToSetBoatHandler}
                >
                  <div
                    className={[
                      "w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed hover:border-2 hover:cursor-pointer hover:border-slate-600 flex-col",
                      c.player[PLAYER.COMPUTER].filled ? 'bg-slate-200' : '',
                      c.player[PLAYER.COMPUTER].shot === SHOT_VALUE.TOUCH ? 'border-red-400 border-2' : '',
                      c.player[PLAYER.COMPUTER].shot === SHOT_VALUE.WATER ? 'border-blue-400 border-2' : '',
                      c.player[PLAYER.HUMAN].shot === SHOT_VALUE.TOUCH ? 'bg-red-400' : '',
                    ].join(' ')}
                  ><div>{c.label}</div><div className='text-xs'>{c.box}</div></div>
                </div>)}
              </div>
            })}
          </div>
          <div>

          </div>
        </div>}
      </div>
    </>
  )
}

export default App
