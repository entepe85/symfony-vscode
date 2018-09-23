import * as vscode from "vscode"
import { AbstractContainerStoreListener } from "../../symfony/AbstractContainerStoreListener";
import { Searchable } from "../../symfony/Searchable";
import { AbstractContainerTreeItem } from "./AbstractContainerTreeItem";

export abstract class AbstractContainerViewProvider extends AbstractContainerStoreListener implements vscode.TreeDataProvider<vscode.TreeItem> {

    protected _onDidChangeTreeData: vscode.EventEmitter<vscode.TreeItem | undefined> = new vscode.EventEmitter<vscode.TreeItem | undefined>();
    readonly onDidChangeTreeData: vscode.Event<vscode.TreeItem | undefined> = this._onDidChangeTreeData.event;
    protected _searchCriteria: string | boolean = false

    setCriteria(criteria: string | boolean): void {
        this._searchCriteria = criteria
        this._onDidChangeTreeData.fire()
    }

    clearCriteria(): void {
        this.setCriteria(false)
    }

    acceptSearchable(searchable: Searchable): boolean {
        return (false === this._searchCriteria || searchable.acceptSearchCriteria(this._searchCriteria.toString()) > 0)
    }

    getTreeItem(element: vscode.TreeItem): vscode.TreeItem | Thenable<vscode.TreeItem> {
        return element
    }

    getChildren(element?: vscode.TreeItem): vscode.ProviderResult<vscode.TreeItem[]> {
        return new Promise(resolve => {
            if (!element) {
                let result: vscode.TreeItem[] = []
                let containerTreeItems: AbstractContainerTreeItem[] = this.getTreeItems()
                containerTreeItems.sort((a, b) => {
                    if (a.label < b.label) {
                        return -1
                    }
                    if (a.label > b.label) {
                        return 1
                    }
                    return 0
                })

                if (false !== this._searchCriteria) {
                    result.push(new vscode.TreeItem("Searching for : " + this._searchCriteria))
                }
                resolve(result.concat(containerTreeItems))
            } else {
                if (element instanceof AbstractContainerTreeItem) {
                    resolve(element.childrenItems)
                } else {
                    resolve([])
                }
            }
        })
    }

    abstract getTreeItems(): AbstractContainerTreeItem[]
}