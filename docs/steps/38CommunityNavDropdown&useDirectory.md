./atoms/directoryMenuAtom.ts
```ts
export type DirectoryMenuItem = {
    displayText: string;
    link: string;
    icon: IconType;
    iconColor: string;
    imageURL?: string;
};

interface DirectoryMenuState {
    isOpen: boolean;
    selectedMenuItem: DirectoryMenuItem;
}

export const defaultMenuItem: DirectoryMenuItem = {
    displayText: "Home",
    link: "/",
    icon: TiHome,
    iconColor: "black",
};

export const defaultMenuState: DirectoryMenuState = {
    isOpen: false,
    selectedMenuItem: defaultMenuItem,
};

export const directoryMenuState = atom<DirectoryMenuState>({
    key: "directoryMenuState",
    default: defaultMenuState,
});
```

./pages/r/[communityId]/index.tsx
```ts
  useEffect(() => {
    setCommunityStateValue((prev) => ({
      ...prev,
      currentCommunity: communityData,
    }));
  }, [communityData]);
```

./hooks/useDirectory.tsx
```ts
const useDirectory = () => {
  const [directoryState, setDirectoryState] =
    useRecoilState(directoryMenuState);
  const router = useRouter();
  const communityStateValue = useRecoilValue(communityState);
  const onSelectMenuItem = (menuItem: DirectoryMenuItem) => {
    setDirectoryState((prev) => ({
      ...prev,
      selectedMenuItem: menuItem,
    }));
    router.push(menuItem.link);
    if (directoryState.isOpen) {
      toggleMenuOpen();
    }
  };

  const toggleMenuOpen = () => {
    setDirectoryState((prev) => ({
      ...prev,
      isOpen: !directoryState.isOpen,
    }));
  };

  useEffect(() => {
    const { currentCommunity } = communityStateValue;
    if (currentCommunity) {
      setDirectoryState((prev) => ({
        ...prev,
        selectedMenuItem: {
          displayText: `r/${currentCommunity.id}`,
          link: `/r/${currentCommunity.id}`,
          imageURL: currentCommunity.imageURL,
          icon: FaReddit,
          iconColor: "blue.500",
        },
      }));
    }
  }, [communityStateValue.currentCommunity]);

  return { directoryState, toggleMenuOpen, onSelectMenuItem };
};
export default useDirectory;
```

./hooks/useCommunityData.tsx
```ts
    try {
      const batch = writeBatch(firestore);
      const newSnippet: CommunitySnippet = {
        communityId: communityData.id,
        imageURL: communityData.imageURL || "",
        isModerator: user?.uid === communityData.creatorId,
      };
```

./components/Navbar/Directory/MenuListItem.tsx
```ts
type MenuListItemProps = {
  displayText: string;
  link: string;
  icon: IconType;
  iconColor: string;
  imageURL?: string;
};

const MenuListItem: React.FC<MenuListItemProps> = ({
  displayText,
  link,
  icon,
  iconColor,
  imageURL,
}) => {
  const { onSelectMenuItem } = useDirectory();
  return (
    <MenuItem
      width="100%"
      fontSize="10pt"
      _hover={{ bg: "gray.100" }}
      onClick={() =>
        onSelectMenuItem({ displayText, link, icon, iconColor, imageURL })
      }
    >
      <Flex align="center">
        {imageURL ? (
          <Image
            src={imageURL}
            borderRadius="full"
            boxSize="18px"
            mr={2}
            alt="community img"
          />
        ) : (
          <Icon as={icon} fontSize={20} mr={2} color={iconColor} />
        )}
        {displayText}
      </Flex>
    </MenuItem>
  );
};
export default MenuListItem;
```

./components/Navbar/Directory/Directory.tsx
```ts
const Directory: React.FC = () => {
  const { directoryState, toggleMenuOpen } = useDirectory();
  return (
    <Menu isOpen={directoryState.isOpen}>
      <MenuButton
        cursor="pointer"
        padding="0px 6px"
        borderRadius="4px"
        mr={2}
        ml={{ base: 0, md: 2 }}
        _hover={{ outline: "1px solid", outlineColor: "gray.200" }}
        onClick={toggleMenuOpen}
      >
        <Flex
          align="center"
          justify="space-between"
          width={{ base: "auto", lg: "200px" }}
        >
          <Flex align="center">
            {directoryState.selectedMenuItem.imageURL ? (
              <Image
                src={directoryState.selectedMenuItem.imageURL}
                alt="communityImg"
                boxSize="24px"
                borderRadius="full"
                mr={2}
              />
            ) : (
              <Icon fontSize={24} mr={{ base: 1, md: 2 }} as={TiHome} />
            )}

            <Flex display={{ base: "none", lg: "flex" }}>
              <Text fontWeight={600} fontSize="10pt">
                {directoryState.selectedMenuItem.displayText}
              </Text>
            </Flex>
          </Flex>
          <ChevronDownIcon color="gray.500" />
        </Flex>
      </MenuButton>
      <MenuList>
        <Communities />
      </MenuList>
    </Menu>
  );
};
export default Directory;
```

./components/Navbar/Directory/Communities.tsx
```ts
const Communities: React.FC = () => {
  const [open, setOpen] = useState(false);
  const mySnippets = useRecoilValue(communityState).mySnippets;
  return (
    <>
      <CreateCommunityModal open={open} handleClose={() => setOpen(false)} />
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MODERATING
        </Text>
        {mySnippets
          .filter((snippet) => snippet.isModerator)
          .map((snippet) => (
            <MenuListItem
              key={snippet.communityId}
              icon={FaReddit}
              displayText={`r/${snippet.communityId}`}
              link={`/r/${snippet.communityId}`}
              iconColor="brand.100"
              imageURL={snippet.imageURL}
            />
          ))}
      </Box>
      <Box mt={3} mb={4}>
        <Text pl={3} mb={1} fontSize="7pt" fontWeight={500} color="gray.500">
          MY COMMUNITIES
        </Text>
        <MenuItem
          width="100%"
          fontSize="10pt"
          _hover={{ bg: "gray.100" }}
          onClick={() => setOpen(true)}
        >
          <Flex align="center">
            <Icon as={GrAdd} fontSize={20} mr={2} />
            Create Community
          </Flex>
        </MenuItem>{" "}
        {mySnippets.map((snippet) => (
          <MenuListItem
            key={snippet.communityId}
            icon={FaReddit}
            displayText={`r/${snippet.communityId}`}
            link={`/r/${snippet.communityId}`}
            iconColor="blue.500"
            imageURL={snippet.imageURL}
          />
        ))}
      </Box>
    </>
  );
};
export default Communities;
```

./components/Navbar/Navbar.tsx
```ts
const { onSelectMenuItem } = useDirectory();
//...
      <Flex
        align="center"
        width={{ base: "40px", md: "auto" }}
        mr={{ base: 0, md: 2 }}
        cursor="pointer"
        onClick={() => onSelectMenuItem(defaultMenuItem)}
      >
```

./components/Community/CreatePostLink.tsx
```ts
  const { toggleMenuOpen } = useDirectory();
    const onClick = () => {
    if (!user) {
      setAuthModalState({ open: true, view: "login" });
      return;
    }
    const { communityId } = router.query;
    if (communityId) {
      router.push(`/r/${communityId}/submit`);
      return;
    }
    toggleMenuOpen();
  };
```

./components/Community/About.tsx
```ts
const onUpdateImage = async () => {
    if (!selectedFile) return;
    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `communities/${communityData.id}/image`);
      await uploadString(imageRef, selectedFile as string, "data_url");
      const downloadURL = await getDownloadURL(imageRef);
      await updateDoc(doc(firestore, "communities", communityData.id), {
        imageURL: downloadURL,
      });
      await updateDoc(
        doc(
          firestore,
          `users/${user?.uid}/communitySnippets`,
          communityData.id
        ),
        {
          imageURL: downloadURL,
        }
      );
//...
```