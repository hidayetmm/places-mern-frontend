import {
  Badge,
  Button,
  Card,
  Container,
  Group,
  Image,
  Text,
  Grid,
  Col,
  useMantineTheme,
  Avatar,
  Modal,
  Center,
} from "@mantine/core";
import classes from "./PlacesHome.module.scss";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useState, useEffect, useContext, useRef } from "react";
import { useNotifications } from "@mantine/notifications";
import { AuthContext, Place } from "../../context/AuthContext";
import { spring } from "react-flip-toolkit";
import { Link } from "react-router-dom";
import { MapContainer, Marker, Popup, TileLayer } from "react-leaflet";
import Leaflet, { LatLngExpression } from "leaflet";

import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import iconRetina from "leaflet/dist/images/marker-icon-2x.png";

let DefaultIcon = Leaflet.icon({
  ...Leaflet.Icon.Default.prototype.options,
  iconUrl: icon,
  iconRetinaUrl: iconRetina,
  shadowUrl: iconShadow,
});
Leaflet.Marker.prototype.options.icon = DefaultIcon;

const PlacesHome = () => {
  const { places, setPlaces, fetchPlacesToggle } = useContext(AuthContext);
  const [isModalOpened, setIsModalOpened] = useState(false);

  const theme = useMantineTheme();
  const notifications = useNotifications();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  const containerRef: any = useRef(null);
  useEffect(() => {
    fetchPlaces().then(() => {
      const boxes = [...containerRef.current.querySelectorAll(".boxItem")];
      boxes.forEach((el, i) => {
        spring({
          config: "gentle",
          values: {
            translateY: [-15, 0],
            opacity: [0, 1],
          },
          onUpdate: (props: any) => {
            el.style.opacity = props.opacity;
            el.style.transform = `translateY(${props.translateY}px)`;
          },
          // delay: i * 25,
          delay: i * 100,
          onComplete: () => {
            // add callback logic here if necessary
          },
        });
      });
    });
  }, [fetchPlacesToggle]);

  const fetchPlaces = async () => {
    try {
      const fetchedPlaces: AxiosResponse = await axios.get("/places");

      if (!fetchedPlaces) {
        return notifications.showNotification({
          message: "Couldn't find any place",
          color: "red",
        });
      }

      setPlaces(fetchedPlaces.data?.places.reverse());
    } catch (err: AxiosError | any) {
      if (axios.isAxiosError(err)) {
        console.log(err?.response);
        if (err.response?.data.message) {
          notifications.showNotification({
            message: err.response?.data.message,
            color: "red",
          });
        }
      } else {
        notifications.showNotification({
          message: err?.message,
          color: "red",
        });
      }
    }
  };

  const BadgeAvatar = ({ imgUrl }: { imgUrl: string }) => {
    return (
      <Avatar
        radius="xl"
        alt="Avatar for badge"
        size={17}
        style={{ marginRight: 5 }}
        src={process.env.REACT_APP_SERVER_LINK + imgUrl}
      />
    );
  };

  const position: LatLngExpression = [51.505, -0.09];

  return (
    <Container className={classes.container} size="xl">
      <Grid ref={containerRef}>
        {places.map((place: Place) => (
          <Col
            key={place.id}
            span={3}
            className={`boxItem ${classes.opacity_0}`}
          >
            <Card shadow="sm" padding="lg">
              <Card.Section>
                <Image
                  src={process.env.REACT_APP_SERVER_LINK + place.image}
                  height={180}
                  alt={place.title}
                  fit="contain"
                />
              </Card.Section>
              <Group
                position="apart"
                style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
              >
                <Text weight={500}>{place.title}</Text>
                <Badge
                  styles={{ root: { padding: "0 4px", cursor: "pointer" } }}
                  color="pink"
                  variant="light"
                  leftSection={<BadgeAvatar imgUrl={place.creator.image} />}
                  component={Link}
                  to={`${place.creator.name}`}
                >
                  {place.creator.name}
                </Badge>
              </Group>
              <Text
                lineClamp={3}
                size="sm"
                style={{
                  color: secondaryColor,
                  lineHeight: 1.5,
                  minHeight: 65,
                  maxHeight: 65,
                }}
              >
                {place.description}
              </Text>
              <Text
                lineClamp={1}
                size="xs"
                style={{
                  color: secondaryColor,
                }}
              >
                {place.address}
              </Text>
              <Button
                variant="light"
                color="blue"
                fullWidth
                style={{ marginTop: 14 }}
                onClick={() => setIsModalOpened(true)}
              >
                View more
              </Button>
            </Card>
            <Modal
              centered
              opened={isModalOpened}
              onClose={() => setIsModalOpened(false)}
            >
              <Card shadow="sm" padding="lg">
                <Card.Section>
                  <Image
                    src={process.env.REACT_APP_SERVER_LINK + place.image}
                    height={180}
                    alt={place.title}
                    fit="contain"
                  />
                </Card.Section>
                <Group
                  position="apart"
                  style={{ marginBottom: 5, marginTop: theme.spacing.sm }}
                >
                  <Text weight={500}>{place.title}</Text>
                  <Badge
                    styles={{ root: { padding: "0 4px", cursor: "pointer" } }}
                    color="pink"
                    variant="light"
                    leftSection={<BadgeAvatar imgUrl={place.creator.image} />}
                    component={Link}
                    to={`${place.creator.name}`}
                  >
                    {place.creator.name}
                  </Badge>
                </Group>
                <Text
                  lineClamp={3}
                  size="sm"
                  style={{
                    color: secondaryColor,
                    lineHeight: 1.5,
                    minHeight: 65,
                    maxHeight: 65,
                  }}
                >
                  {place.description}
                </Text>
                <Text
                  lineClamp={1}
                  size="xs"
                  style={{
                    color: secondaryColor,
                  }}
                >
                  {place.address}
                </Text>
                <div
                  style={{
                    height: 200,
                    border: "1px solid yellow",
                  }}
                >
                  <MapContainer
                    center={[
                      Number(place.location.lat),
                      Number(place.location.lng),
                    ]}
                    zoom={13}
                    scrollWheelZoom={false}
                    style={{ height: 200 }}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <Marker
                      position={[
                        Number(place.location.lat),
                        Number(place.location.lng),
                      ]}
                    >
                      <Popup>
                        A pretty CSS3 popup. <br /> Easily customizable.
                      </Popup>
                    </Marker>
                  </MapContainer>
                </div>
              </Card>
            </Modal>
          </Col>
        ))}
      </Grid>
    </Container>
  );
};

export default PlacesHome;
