import React from 'react';
import PropTypes from 'prop-types';
export default function Loading({ isLoading }) {

  if (!isLoading) return <></>;

    return(
      <div className="absolute flex items-center justify-center top-0 bottom-0 right-0 left-0 bg-black bg-opacity-70 text-5xl">
       <span className="text-white">
        Loading...
       </span>
      </div>
    )
}

Loading.defaultProps = {
  isLoading: false,
};

Loading.propTypes = {
  isLoading: PropTypes.bool,
};
