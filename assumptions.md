Assumptions:

authRegisterV1 assumes that the user may not only enter alphanumeric characters for the nameFirst and nameLast. As names that include non-alphanumeric charcters such as '@' are not valid,
code has been added to authRegisterV1 to account for this unexpected output. The code reads the nameFirst and nameLast for non-alphanumeric characters, if found, the function returns
an error. 

Another assumption is that for all existing functions, logging in is not required. The only requirement is that the registration is a success, and that the registered user is the same as the
current user calling the function.

channelMessagesV1 assumes that a structure 'messages' already exists with data.channels. This needs to be true for channelMessagesV1 to execute. It is assumed that the 'messages' structure will
be added inside a 'MessagesCreate' function in later iterations. Thus, it also assumes that a function for sending messages will also exist. As a result, the current channelMessagesV1 function
can only be tested with stub code, as no structure for 'messages' exists currently.

AuthLoginV1 and authRegisterV1 assumes that the input password does not contain any special or faulty characters that couldn't be typed using the standard english keyboard. This generally refers to symbols or characters that are not on the ascii table. Furthermore, the function assumes that the password length isn't infinite.

For all existing functions, the Microsoft Beans project technically doesn't contain a logout or delete function, which means users and channels once created cannot be removed or logged out of. Therefore, our functions assume the correct data was input for both the users and channels, and cannot be changed after. 

For authRegisterV1 and AuthLoginV1, the function assumes the email is case insensitive signifying it doesn't matter whether the user accidently capitalises their password. This replicates the universal assumptions for the modern email systems such as gmail and hotmail.

