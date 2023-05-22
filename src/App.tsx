import { FC, useEffect, useState } from "react";
import style from "./styles/App.module.css";

import back from "./assets/back.png";

interface SpanProps {
  index: number;
  value: number;
  styled: [number, number, number, string] | null;
}

function App() {
  const [clickIndex, setClickIndex] = useState<number[]>(Array(9).fill(0));
  const [draw, setDraw] = useState<boolean>(false);
  const [player, setPlayer] = useState<[number, string] | null>(null);
  const [winner, setWinner] = useState<number | null>(null);
  const [showGameMode, setShowGmeMode] = useState<boolean>(true);
  const [IA, setIA] = useState<boolean>(false);
  const [toStyle, setToStyle] = useState<
    [number, number, number, string] | null
  >(null);

  useEffect(() => {
    const possibilities: [number, number, number, string][] = [
      [0, 1, 2, "h"],
      [3, 4, 5, "h"],
      [6, 7, 8, "h"],
      [0, 3, 6, "v"],
      [1, 4, 7, "v"],
      [2, 5, 8, "v"],
      [0, 4, 8, "t"],
      [2, 4, 6, "t"],
    ];

    for (let [a, b, c, direction] of possibilities) {
      if (
        clickIndex[a] &&
        clickIndex[a] === clickIndex[b] &&
        clickIndex[a] === clickIndex[c]
      ) {
        setToStyle([a, b, c, direction]);
        setTimeout(() => {
          setWinner(clickIndex[a]);
        }, 3200);
        return;
      }
    }

    if (clickIndex.every(Boolean)) {
      setDraw(true);
    } else if (IA && player && player[0] === 2) {
      const emptyIndices = clickIndex.reduce(
        (indices: number[], value, index) => {
          if (value === 0) {
            indices.push(index);
          }
          return indices;
        },
        []
      );

      const randomIndex =
        emptyIndices[Math.floor(Math.random() * emptyIndices.length)];

      setTimeout(() => {
        setClickIndex((prevClickIndex) => {
          const newClickIndex = [...prevClickIndex];
          newClickIndex[randomIndex] = 2;
          return newClickIndex;
        });

        setPlayer([1, player[1]]);
      }, 300);
    }
  }, [clickIndex, player]);

  const handleClick = (index: number) => {
    if (winner || toStyle || clickIndex[index]) {
      return;
    }

    setClickIndex((prevClickIndex) => {
      const newClickIndex = [...prevClickIndex];
      if (player) newClickIndex[index] = player[0] === 1 ? 1 : 2;
      return newClickIndex;
    });

    setPlayer((prevPlayer) => {
      if (prevPlayer) {
        const alternatePlayer: [number, string] = [...prevPlayer];
        alternatePlayer[0] = prevPlayer[0] === 1 ? 2 : 1;
        return alternatePlayer;
      }
      return null;
    });
  };

  const resetGame = () => {
    setClickIndex(Array(9).fill(0));
    setPlayer(null);
    setWinner(null);
    setDraw(false);
    setToStyle(null);
  };

  const ModalGameMode: FC = () => {
    return (
      <div className={style.modal}>
        <div className={style.modes}>
          <h3 className={style.h3_mode}>Seleciono o modo de jogo</h3>
          <div className={style.div_modes}>
            <button onClick={() => setShowGmeMode(false)}>Modo livre</button>
            <button
              onClick={() => {
                setIA(true);
                setShowGmeMode(false);
              }}
            >
              IA
            </button>
          </div>
        </div>
      </div>
    );
  };

  const Span: FC<SpanProps> = ({ index, value, styled }) => {
    const handleSpanClick = () => {
      handleClick(index);
    };

    return (
      <span className={style.span} onClick={handleSpanClick}>
        {player && (
          <>
            {value === 1
              ? player[1]
              : value === 2 && player[1] === "X"
              ? "O"
              : value === 2 && player[1] === "O"
              ? "X"
              : null}
          </>
        )}
        {styled && (
          <>
            {index === styled[1] && styled[3] === "v" && (
              <span className={style.render_horizontal} />
            )}
            {index === styled[1] && styled[3] === "h" && (
              <span className={style.render_vertical} />
            )}
            {index === styled[1] && styled[2] === 8 && styled[3] === "t" && (
              <span className={style.render_diagonal} />
            )}
            {index === styled[1] && styled[2] === 6 && styled[3] === "t" && (
              <span className={style.render_diagonal2} />
            )}
          </>
        )}
      </span>
    );
  };

  return (
    <main className={style.main}>
      {clickIndex.map((value, index) => (
        <Span index={index} value={value} key={index} styled={toStyle} />
      ))}
      {showGameMode && <ModalGameMode />}
      {(winner || draw) && (
        <div className={style.modal}>
          <div className={style.div_modal}>
            {(IA && winner === 1 && toStyle) && (
              <h3 className={style.h3}>Você ganhou!</h3>
            )}
            {(IA && winner === 2 && toStyle)&& (
              <h3 className={style.h3}>Você perdeu!</h3>
            )}
            {(!IA && winner && toStyle) && (
              <h3 className={style.h3}>O vencedor é o jogador {winner}</h3>
            )}
            {draw && <h3 className={style.h3}>Deu Velha!</h3>}
            <button className={style.button_Reset} onClick={resetGame}>
              Reiniciar
            </button>
          </div>
        </div>
      )}
      {!player && !showGameMode && (
        <div className={style.modal}>
          <button
            onClick={() => setShowGmeMode(true)}
            className={style.button_back}
          >
            <img src={back} alt="back icon" />
          </button>
          <div className={style.div_modal}>
            <h2>Escolha</h2>
            <div className={style.choose}>
              <button onClick={() => setPlayer([1, "X"])}>X</button>
              <button onClick={() => setPlayer([1, "O"])}>O</button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}

export default App;
