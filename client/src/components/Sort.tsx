import React from 'react';
import { css, keyframes } from '@emotion/react';

import { ReactComponent as SortIcon } from '@/assets/sort.svg';
import { useRestaurants } from '@/contexts/restaurants';
import { distance } from '@/utils/distance';
import { color } from '@/utils/theme';

import { Restaurant } from '@devolunch/shared';

const activeKeyFrame = keyframes`
	0% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0.7);
	}

	70% {
		transform: scale(1);
		box-shadow: 0 0 0 10px rgba(0, 0, 0, 0);
	}

	100% {
		transform: scale(0.95);
		box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
	}
`;

const sortStyles = css`
  margin-right: 1rem;
`;

const sortButtonStyles = css`
  display: flex;
  align-items: center;
  background-color: ${color.white};
  padding: 0.25rem 0.5rem;
  border: 1px solid ${color.blue};
  border-radius: 1rem;
  font-size: 1rem;
  font-weight: bold;
  cursor: pointer;
  color: ${color.blue};

  &:hover {
    background-color: ${color.orange};
  }

  &[data-active='1'] {
    background-color: ${color.orange};
    animation: ${activeKeyFrame} 1s infinite;
  }
`;

const sortIconStyles = css`
  width: 0.75rem;
  margin-right: 0.375rem;
  fill: ${color.blue};
`;

export default function Sort() {
  const { restaurants, setRestaurants } = useRestaurants();
  const [active, setActive] = React.useState(0);

  const sortOnLocation = () => {
    setActive(1);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;

        setRestaurants(
          restaurants
            .map((r: Restaurant) => ({
              ...r,
              distance: distance(latitude, r.latitude, longitude, r.longitude),
            }))
            .sort((a: Restaurant, b: Restaurant) => a.distance - b.distance),
        );

        window.localStorage.setItem('position', `${latitude},${longitude}`);
        setActive(0);
      },
      () => {
        setActive(0);
      },
    );
  };

  return (
    <div css={sortStyles}>
      <button css={sortButtonStyles} onClick={sortOnLocation} onAnimationEnd={() => setActive(0)} data-active={active}>
        <SortIcon css={sortIconStyles} />
        Sort by my location
      </button>
    </div>
  );
}
