import './loading.css';
import PropTypes from 'prop-types';

const Loading = (props) => {
    const { show, inline } = props;
    return (
        <div className={`${inline ? 'loading-inline' : 'loading-overlay'} ${show ? 'active' : ''}`}>
            Loading...
        </div>
    )
};

Loading.propTypes = {
    show: PropTypes.bool,
    inline: PropTypes.bool
};

Loading.defaultProps = {
    show: false,
    inline: false
};

export default Loading;