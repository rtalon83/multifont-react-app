<multifont>
    <common scaleW="{{scaleW}}" scaleH="{{scaleH}}" file="{{file_name}}"/>
    <fonts>
    {{#fonts}}
        <font face="{{name}}" size="{{size}}" lineHeight="{{lineHeight}}">
            <chars count="{{chars_count}}">
            {{#chars}}
                <char letter="{{letter}}" id="{{code}}" x="{{x}}" y="{{y}}" width="{{width}}" height="{{height}}" xoffset="{{xoffset}}" yoffset="{{yoffset}}" xadvance="{{xadvance}}" />
            {{/chars}}
            </chars>
            <kernings count="{{kernings_count}}">
            {{#kernings}}
            {{/kernings}}
            </kernings>
        </font>
    {{/fonts}}
    </fonts>
</multifont>
