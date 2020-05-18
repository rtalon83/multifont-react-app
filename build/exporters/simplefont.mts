<font>
    <info face="{{name}}" size="{{size}}" />
    <common lineHeight="{{lineHeight}}" scaleW="{{scaleW}}" scaleH="{{scaleH}}" pages="{{num_pages}}" />
    <pages>
    {{#pages}}
        <page id="{{id_page}}" file="{{file_name}}" />
    {{/pages}}
    </pages>
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
