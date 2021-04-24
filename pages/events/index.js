import Head from 'next/head';
import { Fragment } from 'react';
import { useRouter } from 'next/router';

import { getAllEvents } from '../../helpers/api-util';
import EventList from '../../components/events/event-list';
import EventsSearch from '../../components/events/events-search';

const AllEventsPage = (props) => {
    const { events } = props;
    const router = useRouter();
    debugger;

    const findEventsHandler = (year, month) => {
        const fullPath = `/events/${year}/${month}`;
        router.push(fullPath);
    };

    return (
        <Fragment>
            <Head>
                <title>All Events page</title>
                <meta name="description" content="All great events"></meta>
            </Head>
            <EventsSearch onSearch={findEventsHandler} />
            <EventList items={events} />
        </Fragment>
    );
};

export async function getStaticProps() {
    const allEvents = await getAllEvents();

    return {
        props: {
            events: allEvents,
        },
        revalidate: 60,
    };
}

export default AllEventsPage;
