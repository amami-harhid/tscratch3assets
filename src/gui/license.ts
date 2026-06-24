type LicenseContext = {title:string, text:string}[];
export const license = (modalContext: HTMLDivElement): void =>{

    const licenseContext:LicenseContext = [
        {title: '', text:'A web application for browsing and accessing images and sounds from the Scratch editor asset library.<br/>Scratchエディタで使用されている画像・音素材をブラウズできるWebアプリです。'},
        {title:'1.⚠️ Disclaimer (免責事項)', text: 'This project is <b>NOT affiliated with, endorsed by, or officially connected to the Scratch Foundation</b>.<br/>本プロジェクトは<b>Scratch Foundationとは一切関係ありません(非公式)</b>。<br/>提携・承認・公式プロジェクトではありません。' },
        {title:'2.📦 Features (主な機能)', text: '<ul><li>Browse Scratch images (costumes, backdrops): --Scratchの画像（コスチューム・背景）の閲覧</li><li>Play Scratch sounds: --Scratchの音声の再生</li><li>Get direct asset URLs: --素材URLの取得</li><li>Simple and fast interface: --シンプルなUI</li></ul>' },
        {title:'3.📚 Data Source (データ出典)', text: 'Asset metadata is retrieved from:(素材メタデータは以下から取得しています)<br/><code>https://github.com/scratchfoundation/scratch-gui</code><br/>' },
        {title:'4.🖼️ Asset License (素材のライセンス)', text: 'All images and sounds provided through this project are originally from the Scratch Foundation.<br/>They are licensed under:<br/>本プロジェクトで扱う画像・音素材は、Scratch Foundationが提供するものです。<br/>以下のライセンスで公開されています：' },
        {title:'', text: '<h3><b>Creative Commons Attribution-ShareAlike 2.0(CC BY-SA 2.0)</b></h3><code>https://creativecommons.org/licenses/by-sa/2.0/</code>' },
        {title:'', text: '<h3>© Scratch Foundation<br/><code>https://scratch.mit.edu</code></h3>' },
        {title:'', text: '<h3>Requirements (利用条件)</h3>' },
        {title:'', text: '<ul><li>You must give appropriate credit: --クレジット表示が必要です</li><li>You must redistribute under the same license (ShareAlike) -- 再配布時は同一ライセンス（CC BY-SA 2.0）を適用する必要があります</li></ul>' },
        {title:'5.💻 Code License (コードのライセンス)', text: 'This project’s source code is licensed under:<br/>本プロジェクトのソースコードは以下のライセンスで公開されています：' },
        {title:'', text: 'See the LICENSE file for details.<br/>詳細は LICENSE ファイルをご確認ください。' },
        {title:'', text: '<b>GNU Affero General Public License v3.0（AGPL-3.0)</b>' },
        {title:'6.🔧 Notes (補足)', text: '<ul><li>No modifications are made to original assets unless stated</li><li>Asset ownership remains with the Scratch Foundation</li><li>Some characters (e.g., Scratch Cat) may also be protected by trademark</li></ul>' },
        {title:'', text: '<ul><li>元の素材は基本的に変更していません（特記がある場合を除く）</li><li>素材の権利はScratch Foundationに帰属します</li><li>一部キャラクターは商標として保護されている可能性があります</li></ul>' },
        {title:'7.🚀 Usage (使い方)', text: '(1) Open the web app (サイトにアクセス)' },
        {title:'', text: '(2) Browse assets (素材を選択)' },
        {title:'', text: '(3) Copy URLs or play sounds (URL取得または再生)' },
        {title:'8.📜 Legal (法的事項)', text: 'By using this project, you agree to comply with:' },
        {title:'', text: '<ul><li>CC BY-SA 2.0 (for assets)</li><li>AGPL-3.0 (for source code)</li></ul>' },
        {title:'', text: '本プロジェクトを利用することにより、以下に同意したものとみなします：' },
        {title:'', text: '<ul><li>CC BY-SA 2.0（素材）</li><li>AGPL-3.0（コード）</li></ul>' },
        {title:'9.✉️ Contact (連絡先)', text: '[@Amami-harhid](https://github.com/amami-harhid)' },
    ];
    for(const elem of licenseContext){
        if(elem.title){
            const h2 = document.createElement('h2') as HTMLHeadingElement;
            h2.innerHTML = elem.title
            modalContext.appendChild(h2);
        }
        const text = document.createElement('p') as HTMLParagraphElement;
        text.innerHTML = elem.text;
        modalContext.appendChild(text);
    }
}