import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

const BOATS = [{
  battleship: 5,
}, {
  destroyer: 4,
}, {
  destroyer: 4,
  }];

const BOARD_SIZE = 10;
const LETTERS = "ABCDEFGHIJ";

const generateItems = () => {
  let row = 0;
  return Array.from(new Array(BOARD_SIZE * BOARD_SIZE)).map((i, index) => {
    if (index % BOARD_SIZE === 0) {
      row++;
    }

    const col = (index % BOARD_SIZE + 1);

    return {
      box: index + 1,
      col,
      row,
      label: `${LETTERS[col - 1]}${row}`,
      done: false
    };
  });
}

const createBoard = (items: any[]) => {
  let row: any[] = [];
  return items.reduce((a: any[], b: any) => {
    if ((b.col % BOARD_SIZE) === 0) {
      row.push(b);
      a.push(row);
      row = [];
    } else {
      row.push(b);
    }

    return a;
  }, [])
}

function App() {
  const [cursorPosition, setCursorPosition] = useState<any>({});
  const [items, setItems] = useState<any[]>(generateItems());
  const [orientation, setOrientation] = useState<"vertical" | "horizontal">("horizontal");

  const setBoatPosition = useCallback(({ box, row, boat }: any, o: any) => {
    // const horizontal = true;
    // const vertical = false;
    const horizontal = (o || orientation) === "horizontal";
    const vertical = (o || orientation) === "vertical";
    console.log("AAAAA", {horizontal, vertical})
    let boxes = [box]
    if (horizontal) {
      // const boat = BOATS[0].battleship as number;
      const rest = Math.ceil(boat / 2);
      const endRow = BOARD_SIZE * row;
      const restToEnd = endRow - box;
      const restToStart = (box - (endRow - BOARD_SIZE) - rest) * -1;
      if (restToEnd >= 2) {
        if (rest === 3) {
          boxes = [...boxes, ...Array.from(new Array(2)).map((_, k) => box + k +1)]
        }
      } else {
        boxes = [...boxes, ...Array.from(new Array(restToEnd)).map((_, k) => box + k + 1)]
      }

      if (restToStart > 0) {
        boxes = [
          ...boxes,
          ...Array.from(new Array(restToStart)).map((_, k) => box + rest + (k)),
        ]
      }

      if (boxes.length < boat) {
        boxes = [
          ...Array.from(new Array(boat - boxes.length)).map((_, k) => box - (k + 1)).reverse(),
          ...boxes,
        ]
      }
    }

    if (vertical) {
      const boat = BOATS[0].battleship as number;
      const rest = Math.ceil(boat / 2);
      const endRow = BOARD_SIZE * row;
      const restToEnd = endRow - box;
      const restToStart = (box - (endRow - BOARD_SIZE) - rest) * -1;
      boxes = [
        ...Array.from(new Array(2)).map((_, k) => {
          return box - ((k + 1) * BOARD_SIZE)
        }).reverse(),
        ...boxes,
        ...Array.from(new Array(2)).map((_, k) => {
          return box + ((k + 1) * BOARD_SIZE)
        })
      ];

      const outTop = boxes.filter(i => i < 0).length;
      const outBottom = boxes.filter(i => i > 100).length;

      if (outTop) {
        boxes = [
          ...boxes.slice(outTop),
          ...Array.from(new Array(rest)).map((_, k) => {
            return box +  ((k +  outTop) * BOARD_SIZE)
          })
        ];
      }
      if (outBottom) {
        boxes = [
          ...Array.from(new Array(rest)).map((_, k) => {
            return box - ((k +  outBottom) * BOARD_SIZE)
          }),
          ...boxes.slice(0, -outBottom),
        ];
      }
    }

    setItems((prevItems) => {
      return structuredClone(prevItems.map((i, k) => {
        if (boxes.includes(i.box)) {
          i.done = true
        } else {
          i.done = false
        }

        return i
      }))
    })

    console.log("AAA")
  }, [orientation, setItems])

  const onKeydownHandler = useCallback(async ($event: any) => {
    if ($event.code === "Space") {
      await setOrientation((prev) => {
        console.log("prev", prev)
        if (prev === "vertical") {
          return "horizontal";
        }

        return "vertical";
      })

      console.log("cursorPosition", {cursorPosition, orientation})
      setBoatPosition(cursorPosition, orientation === "horizontal" ? "vertical" : "horizontal");
    }
  }, [cursorPosition, setBoatPosition]);

  useEffect(() => {
    document.addEventListener("keydown", onKeydownHandler);

    return () => {
      document.removeEventListener("keydown", onKeydownHandler);
    }
  }, [onKeydownHandler, setOrientation])

  const board = useMemo(() => {
    return createBoard(items);
  }, [items])

  const update = () => {
    setItems((prevItems) => {
      prevItems[35].done = true;

      return structuredClone(prevItems);
    })
  }

  const update2 = () => {
    // const index = squares.findIndex((s: any) => s.label === "A2");
    // squares[index].hit = true;
    // setSquares(structuredClone(squares))
  }

  const onMouseOverHandler = ($event: any) => {
    const { box, row } = JSON.parse($event.target.dataset.position);

    setCursorPosition({ box, row, boat: BOATS[0].battleship });
    setBoatPosition({ box, row, boat: BOATS[0].battleship });
  }

  return (
    <>
      <button onClick={update}>HIT</button>
      <button onClick={update2}>HIT2</button>
      <pre>{JSON.stringify(items[35], null, 2)}</pre>

      <div className='flex flex-col'>
        {board.map((r, rowKey) => {
          return <div key={rowKey} className='flex'>
            {r.map((c: any) => <>
              <div className={[
                  "w-[50px] h-[50px] flex items-center justify-center text-xs border border-dashed hover:bg-slate-50 hover:cursor-pointer",
                  c.done ? 'bg-red-500' : '',
              ].join(' ')}
                data-position={`{ "col": ${c.col}, "row": ${c.row}, "box": ${BOARD_SIZE * (c.row -1) + c.col} }`}
                onMouseOver={onMouseOverHandler}
                key={c.label}>{c.label}{JSON.stringify(c.hit)}</div>
            </>)}
          </div>
        })}
      </div>
    </>
  )
}

export default App
