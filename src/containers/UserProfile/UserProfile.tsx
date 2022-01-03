import { useState, useEffect, useRef, useContext } from "react";
import { useParams } from "react-router-dom";
import {
  Badge,
  Button,
  Card,
  Col,
  Container,
  Grid,
  Group,
  Text,
  Image,
  Avatar,
  useMantineTheme,
  ActionIcon,
  Popover,
} from "@mantine/core";
import axios, { AxiosError, AxiosResponse } from "axios";
import { AuthContext, Place } from "../../context/AuthContext";
import { useNotifications } from "@mantine/notifications";
import { spring } from "react-flip-toolkit";
import classes from "../PlacesHome/PlacesHome.module.scss";
import { DeleteIcon, EditIcon } from "../../components/Header/Icons";

const UserProfile = () => {
  type ProfileData = {
    email: string;
    image: string;
    name: string;
    password: string;
  };

  const { userData, fetchPlacesToggle, setFetchPlacesToggle } =
    useContext(AuthContext);

  const { username } = useParams<"username">();

  const [userPlaces, setUserPlaces] = useState<Place[]>();
  const [userProfileData, setUserProfileData] = useState<ProfileData>();
  const [isDeletePopoverOpened, setIsDeletePopoverOpened] =
    useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const notifications = useNotifications();
  const containerRef: any = useRef(null);
  const theme = useMantineTheme();
  const secondaryColor =
    theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[7];

  useEffect(() => {
    getUserPlaces().then((places) => {
      if (places) {
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
      }
    });
  }, [fetchPlacesToggle]);

  const getUserPlaces = async () => {
    const url = `places/user/${username}`;

    try {
      const response: AxiosResponse = await axios.get(url);
      const { places, ...userProfile } = await response.data?.data;
      if (places || userProfile) {
        setUserPlaces(places);
        setUserProfileData(userProfile);
        return places;
      } else {
        throw new Error("Something went wrong.");
      }
    } catch (err: AxiosError | any) {
      if (err.response.status === 404) {
        notifications.showNotification({
          message: "No places found.",
          color: "red",
        });
      }
    }
  };

  const deletePlaceHandler = async (placeId: string) => {
    setLoading(true);
    const url = `places/${placeId}`;
    const headers = { Authorization: `Bearer ${userData.accessToken}` };

    try {
      const response: AxiosResponse = await axios.delete(url, { headers });
      if (response) {
        setFetchPlacesToggle();
        notifications.showNotification({
          message: response.data.message,
        });
      }
      setLoading(false);
    } catch (err: AxiosError | any) {
      notifications.showNotification({
        message: err.message,
        color: "red",
      });
      setLoading(false);
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

  const popoverHandler = (placeId: string) => {
    if (isDeletePopoverOpened === placeId) {
      setIsDeletePopoverOpened("");
    } else {
      setIsDeletePopoverOpened(placeId);
    }
  };

  return (
    <>
      {userProfileData && (
        <Container className={classes.container} size="xl">
          <div className={classes.topBadge}>
            <Badge size="xl">{username}</Badge>
          </div>

          <Grid ref={containerRef}>
            {userPlaces?.map((place: Place) => (
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
                      styles={{ root: { padding: "0 4px" } }}
                      color="pink"
                      variant="light"
                      leftSection={
                        <BadgeAvatar imgUrl={userProfileData.image} />
                      }
                    >
                      {username}
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
                  <Group style={{ paddingTop: 14 }}>
                    <Button
                      variant="light"
                      color="blue"
                      style={{ flexGrow: 1 }}
                    >
                      View
                    </Button>
                    {userData.username === userProfileData.name && (
                      <>
                        <ActionIcon>
                          <EditIcon />
                        </ActionIcon>
                        <Popover
                          onClose={() => setIsDeletePopoverOpened("")}
                          position="bottom"
                          target={
                            <ActionIcon
                              onClick={() => popoverHandler(place.id)}
                            >
                              <DeleteIcon />
                            </ActionIcon>
                          }
                          opened={isDeletePopoverOpened === place.id}
                        >
                          <Text size="sm">Are you sure?</Text>
                          <Button
                            loading={loading}
                            onClick={() => deletePlaceHandler(place.id)}
                          >
                            Delete
                          </Button>
                        </Popover>
                      </>
                    )}
                  </Group>
                </Card>
              </Col>
            ))}
          </Grid>
        </Container>
      )}
    </>
  );
};

export default UserProfile;
