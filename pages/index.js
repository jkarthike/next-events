import Head from 'next/head';

import { getFeaturedEvents } from '../helpers/api-util';
import EventList from '../components/events/event-list';

const HomePage = (props) => {
    const { events } = props;

    return (
        <div>
            <Head>
                <title>NextJs Events</title>
                <meta
                    name="description"
                    content="Find lot of great events"
                ></meta>
            </Head>
            <EventList items={events} />
        </div>
    );
};

export async function getStaticProps() {
    const featuredEvents = await getFeaturedEvents();

    return {
        props: {
            events: featuredEvents,
        },
        revalidate: 1800,
    };
}

export default HomePage;
