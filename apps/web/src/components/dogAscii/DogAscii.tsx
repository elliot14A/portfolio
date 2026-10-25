import type { JSX } from "preact";
import { useState } from "preact/hooks";
import { critterContainer, dogArt, dogButton, mover } from "./dogAscii.css";

const ROCKY_GERMAN_SHEPHERD = `  ^..^      /
  /_/\\_____/
     /\\   /\\
    /  \\ /  \\`;

const ROCKY_GERMAN_SHEPHERD_BARK = `  ^..^      /
  /_/\\_____/  *woof!*
     /\\   /\\
    /  \\ /  \\`;

export const DogAscii = (): JSX.Element => {
  const [isBarking, setIsBarking] = useState(false);

  const handleClick = (): void => {
    setIsBarking(true);
    setTimeout(() => {
      setIsBarking(false);
    }, 2000);
  };

  return (
    <div className={critterContainer} aria-hidden="true">
      <div className={mover}>
        <button
          type="button"
          className={dogButton}
          onClick={handleClick}
          aria-label="Rocky the German Shepherd"
        >
          <pre className={dogArt}>
            {isBarking ? ROCKY_GERMAN_SHEPHERD_BARK : ROCKY_GERMAN_SHEPHERD}
          </pre>
        </button>
      </div>
    </div>
  );
};
