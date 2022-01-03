import {
  Header,
  Title,
  useMantineTheme,
  UnstyledButton,
  Group,
  Text,
  Avatar,
  Menu,
  Divider,
  Button,
  Modal,
  TextInput,
  Checkbox,
  ActionIcon,
} from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useNotifications } from "@mantine/notifications";
import { useForm } from "@mantine/hooks";
import axios, { AxiosResponse, AxiosError } from "axios";
import { useState, useContext } from "react";
import { AuthContext, defaultState } from "../../context/AuthContext";
import { ThemeContext } from "../../context/ThemeContext";
import classes from "./Header.module.scss";
import {
  DarkModeIcon,
  LightModeIcon,
  UserIcon,
  MessageIcon,
  SettingsIcon,
  SearchIcon,
  LogoutIcon,
  UserImageIcon,
  AddIcon,
} from "./Icons";
import { useNavigate } from "react-router-dom";
import AddPlaceModal from "./AddPlaceModal";

const HeaderComponent = () => {
  const [isLoginLogoutModalOpened, setIsLoginLogoutModalOpened] =
    useState<boolean>(false);
  const [isAddPlaceModalOpened, setIsAddPlaceModalOpened] =
    useState<boolean>(false);
  const [profileImage, setProfileImage] = useState<File[]>();
  const [loginOrLogout, setLoginOrLogout] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const { colorScheme } = useMantineTheme();
  const { toggleDark } = useContext(ThemeContext);
  const { userData, setUserData } = useContext(AuthContext);
  const notifications = useNotifications();

  const signupForm = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      // termsOfService: false,
    },
    validationRules: {
      email: (value) => /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value),
    },
  });

  const loginForm = useForm({
    initialValues: {
      email: "",
      password: "",
      // termsOfService: false,
    },
    validationRules: {
      email: (value) => /[^@ \t\r\n]+@[^@ \t\r\n]+\.[^@ \t\r\n]+/.test(value),
    },
  });

  const navigate = useNavigate();
  const logoutHandler = () => {
    setUserData(defaultState.userData);
    localStorage.removeItem("userData");
    navigate("/");
  };

  const LoggedInMenu = () => (
    <Menu
      classNames={{
        itemIcon: classes.userMenu,
      }}
      control={
        <UnstyledButton
          sx={(theme) => ({
            padding: 6,
            borderRadius: 4,
            "&:active": {
              WebkitTransform: "translateY(1px)",
              MozTransform: "translateY(1px)",
              msTransform: "translateY(1px)",
              transform: "translateY(1px)",
            },
            "&:hover": {
              backgroundColor:
                theme.colorScheme === "dark" ? "#141517" : theme.colors.gray[0],
            },
          })}
        >
          <Group>
            <div>
              <Text>{userData.username}</Text>
              <Text size="xs" color="gray">
                {userData.email}
              </Text>
            </div>
            <Avatar
              src={process.env.REACT_APP_SERVER_LINK + userData.image}
              size={40}
              color="blue"
            />
          </Group>
        </UnstyledButton>
      }
    >
      <Menu.Label>Application</Menu.Label>
      <Menu.Item icon={<UserIcon />}>Profile</Menu.Item>
      <Menu.Item icon={<MessageIcon />}>Messages</Menu.Item>
      <Menu.Item icon={<SettingsIcon />}>Settings</Menu.Item>
      <Menu.Item
        icon={<SearchIcon />}
        rightSection={
          <Text size="xs" color="dimmed">
            ⌘K
          </Text>
        }
      >
        Search
      </Menu.Item>
      <Divider />
      <Menu.Label>Danger zone</Menu.Label>
      <Menu.Item color="red" icon={<LogoutIcon />} onClick={logoutHandler}>
        Log out
      </Menu.Item>
    </Menu>
  );

  const LoggedOutMenu = () => (
    <>
      <Button
        onClick={() => {
          setIsLoginLogoutModalOpened(true);
          setLoginOrLogout("login");
        }}
      >
        Login
      </Button>
      <Button
        onClick={() => {
          setIsLoginLogoutModalOpened(true);
          setLoginOrLogout("logout");
        }}
      >
        Signup
      </Button>
    </>
  );

  const loginHandler = async (values: { email: string; password: string }) => {
    setLoading(true);

    const url = "/users/login";

    try {
      const response: AxiosResponse = await axios.post(url, values);
      setLoading(false);
      console.log(response.data);
      setIsLoginLogoutModalOpened(false);

      const newUserData = {
        id: response.data.user.id,
        username: response.data.user.name,
        email: response.data.user.email,
        accessToken: response.data.user.token,
        image: response.data.user.image,
        isLoggedIn: true,
      };
      setUserData(newUserData);
      localStorage.setItem("userData", JSON.stringify(newUserData));

      notifications.showNotification({
        message: `Welcome @${response.data.user.name}!`,
      });
    } catch (err: AxiosError | any) {
      if (axios.isAxiosError(err)) {
        setLoading(false);
        console.log(err?.response);
        notifications.showNotification({
          message: err.response?.data.message,
          color: "red",
        });
      } else {
        notifications.showNotification({
          message: err?.message,
          color: "red",
        });
      }
    }
  };

  const signupHandler = (values: {
    username: string;
    email: string;
    password: string;
  }) => {
    setLoading(true);

    const formData = new FormData();
    formData.append("name", values.username);
    formData.append("email", values.email);
    formData.append("password", values.password);
    if (profileImage) {
      formData.append("image", profileImage[0]);
    }

    const url = "/users/signup";
    axios
      .post(url, formData)
      .then((res: AxiosResponse) => {
        setLoading(false);
        console.log(res.data.user);
        if (res.data.user) {
          setIsLoginLogoutModalOpened(false);

          const newUserData = {
            id: res.data.user.id,
            username: res.data.user.name,
            email: res.data.user.email,
            accessToken: res.data.user.token,
            image: res.data.user.image,
            isLoggedIn: true,
          };
          setUserData(newUserData);
          localStorage.setItem("userData", JSON.stringify(newUserData));

          notifications.showNotification({
            message: `Welcome @${res.data.user.name}!`,
          });
        }
      })
      .catch((err: AxiosError) => {
        setLoading(false);
        console.log(err);
        if (err.response?.data.message) {
          notifications.showNotification({
            message: err.response?.data.message,
            color: "red",
          });
        } else {
          notifications.showNotification({
            message: err.message,
            color: "red",
          });
        }
      });
  };

  return (
    <Header fixed className={classes.header} height={60} padding="xl">
      <Title order={3}>Places</Title>
      <Group spacing="xl">
        <ActionIcon
          onClick={() => toggleDark(colorScheme === "light" ? true : false)}
        >
          {colorScheme === "dark" ? <LightModeIcon /> : <DarkModeIcon />}
        </ActionIcon>
        {userData.isLoggedIn && (
          <ActionIcon onClick={() => setIsAddPlaceModalOpened(true)}>
            <AddIcon />
          </ActionIcon>
        )}
        {userData.isLoggedIn ? <LoggedInMenu /> : <LoggedOutMenu />}
      </Group>
      <Modal
        centered
        opened={isLoginLogoutModalOpened}
        onClose={() => setIsLoginLogoutModalOpened(false)}
        title={loginOrLogout === "login" ? "Login" : "Signup"}
      >
        {loginOrLogout === "login" ? (
          <form onSubmit={loginForm.onSubmit(loginHandler)}>
            <TextInput
              id="0"
              required
              label="Email"
              placeholder="your@email.com"
              {...loginForm.getInputProps("email")}
            />
            <TextInput
              id="1"
              required
              label="Password"
              {...loginForm.getInputProps("password")}
            />
            <Checkbox
              mt="md"
              label="Save the password"
              // {...loginForm.getInputProps("termsOfService", { type: "checkbox" })}
            />
            <Button loading={loading} style={{ float: "right" }} type="submit">
              Submit
            </Button>
          </form>
        ) : (
          <form onSubmit={signupForm.onSubmit(signupHandler)}>
            <TextInput
              id="0"
              required
              label="Username"
              placeholder="Your username"
              {...signupForm.getInputProps("username")}
            />
            <TextInput
              id="1"
              required
              label="Email"
              placeholder="your@email.com"
              {...signupForm.getInputProps("email")}
            />
            <TextInput
              id="2"
              required
              label="Password"
              {...signupForm.getInputProps("password")}
            />
            <Group>
              <Dropzone
                multiple={false}
                styles={{
                  root: {
                    maxWidth: 60,
                    maxHeight: 60,
                  },
                }}
                onDrop={(files) => setProfileImage(files)}
                maxSize={3 * 1024 ** 2}
                accept={IMAGE_MIME_TYPE}
              >
                {(status) => (
                  <UserImageIcon
                  // status={status}
                  // style={{
                  //   width: 80,
                  //   height: 80,
                  //   color: getIconColor(status, theme),
                  // }}
                  />
                )}
              </Dropzone>
              <Text size="sm" color="dimmed">
                Upload your profile image, just drop
              </Text>
            </Group>
            <Checkbox
              mt="md"
              label="Save the password"
              // {...signupForm.getInputProps("termsOfService", {
              //   type: "checkbox",
              // })}
            />
            <Button loading={loading} style={{ float: "right" }} type="submit">
              Submit
            </Button>
          </form>
        )}
      </Modal>
      {/* Add Place modal */}
      <Modal
        size="xl"
        centered
        title="Add a place"
        opened={isAddPlaceModalOpened}
        onClose={() => setIsAddPlaceModalOpened(false)}
      >
        <AddPlaceModal setIsAddPlaceModalOpened={setIsAddPlaceModalOpened} />
      </Modal>
    </Header>
  );
};

export default HeaderComponent;
