import moment from 'moment';

export const displayEnvironmentMessage = () => {
    if (process.env.NODE_ENV != 'production') {
        console.log('Application has started');
    };
};

export const formatDateTime = (oldDate, template) => {
    return moment(oldDate).format(template);
};