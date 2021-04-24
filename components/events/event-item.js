import Image from 'next/image';
import Button from '../../components/ui/button';
import DateIcon from '../../components/icons/date-icon';
import AddressIcon from '../../components/icons/address-icon';
import ArrowRightIcon from '../../components/icons/arrow-right-icon';
import classes from './event-item.module.css';

const EventItem = (props) => {
    const { title, image, date, location, id } = props;
    const readableDate = new Date(date).toLocaleDateString('en-DE', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });
    const formattedAddress = location.replace(', ', '\n');
    const exploreLink = `/events/${id}`;

    return (
        <li className={classes.item}>
            <Image src={`/${image}`} alt={title} width={250} height={160} />
            <div className={classes.content}>
                <div className={classes.summary}>
                    <h2>{title}</h2>
                    <div className={classes.date}>
                        <DateIcon />
                        <time>{readableDate}</time>
                    </div>
                    <div className={classes.address}>
                        <AddressIcon />
                        <address>{formattedAddress}</address>
                    </div>
                </div>
                <div className={classes.actions}>
                    <Button link={exploreLink}>
                        <span>Explore event</span>
                        <span className={classes.icon}>
                            <ArrowRightIcon />
                        </span>
                    </Button>
                </div>
            </div>
        </li>
    );
};

export default EventItem;
