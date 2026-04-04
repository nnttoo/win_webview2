import { callWw2 } from "win_webview2/browser";
callWw2({
    openFolderDialog: {
        filter: "",
        ownerClassName: "testOwner"
    }
});
