https://console.firebase.google.com/project
Cloud Firestore -> Create Database -> test mode

check for special characters in string stackoverflow
https://stackoverflow.com/questions/32311081/check-for-special-characters-in-string

Cloud Firestore Get data
https://firebase.google.com/docs/firestore/query-data/get-data
./components/Modal/CreateCommunity/CreateCommunityModal.tsx
```tsx
const handleCreateCommunity = async () => {
    if (error) setError("");
    const format = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    if (format.test(communityName) || communityName.length < 3) {
      setError(
        "Community names must be between 3-21 characters, and can only contain letters, numbers or underscoreds"
      );
      return;
    }
    setLoading(true);

    try {
      const communityDocRef = doc(firestore, "communities", communityName);
      const communityDoc = await getDoc(communityDocRef);
      if (communityDoc.exists()) {
        setError(`Sorry, r/${communityName} is taken. Try another.`);
        return;
      }

      await setDoc(communityDocRef, {
        creatorId: user?.uid,
        createdAt: serverTimestamp(),
        numberOfMembers: 1,
        privacyType: communityType,
      });
    } catch (error: any) {
      console.log("handleCreateCommunity error", error);
      setError(error.message);
    }
    setLoading(false);
  };
            <Button
              height="30px"
              isLoading={loading}
              onClick={handleCreateCommunity}
            >
```